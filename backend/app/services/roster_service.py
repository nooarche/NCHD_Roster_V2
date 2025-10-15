from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from datetime import datetime, date
import logging

from ..models import Shift, User, Post, Leave
from ..engine.roster_engine import RosterEngine, UserConstraints, Shift as EngineShift
from ..services.roster_import import RosterImporter, create_user_map, create_post_map

logger = logging.getLogger(__name__)

class RosterService:
    """Service layer bridging database and roster engine"""
    
    def __init__(self, db: Session):
        self.db = db
        self.engine = RosterEngine()
    
    def load_shifts_from_db(self, start_date: Optional[date] = None, 
                           end_date: Optional[date] = None) -> List[Shift]:
        """Load shifts from database with optional date filtering"""
        query = self.db.query(Shift)
        
        if start_date:
            query = query.filter(Shift.start >= datetime.combine(start_date, datetime.min.time()))
        if end_date:
            query = query.filter(Shift.end <= datetime.combine(end_date, datetime.max.time()))
        
        return query.all()
    
    def sync_engine_from_db(self, start_date: Optional[date] = None, 
                           end_date: Optional[date] = None):
        """Load existing shifts into engine"""
        shifts = self.load_shifts_from_db(start_date, end_date)
        
        roster_data = [{
            'user_id': s.user_id,
            'post_id': s.post_id,
            'start': s.start,
            'end': s.end,
            'type': s.shift_type,
            'labels': s.labels or {}
        } for s in shifts]
        
        # Load user constraints
        user_constraints = self._load_user_constraints()
        
        self.engine.import_existing_roster(roster_data, user_constraints)
        logger.info(f"Loaded {len(shifts)} shifts into engine")
    
    def _load_user_constraints(self) -> Dict[int, UserConstraints]:
        """Build user constraints from database"""
        users = self.db.query(User).all()
        constraints = {}
        
        for user in users:
            # Get leave periods
            leave_periods = [(lv.start, lv.end) for lv in user.leave_periods]
            
            # Get OPD days from user's posts (if applicable)
            opd_days = set()
            # TODO: Extract from post eligibility/rules
            
            constraints[user.id] = UserConstraints(
                user_id=user.id,
                max_nights_per_month=7,  # Default, could come from post
                min_rest_hours=11,
                max_consecutive_nights=3,
                opd_days=opd_days,
                leave_periods=leave_periods
            )
        
        return constraints
    
    def create_shift(self, user_id: int, post_id: int, start: datetime, 
                    end: datetime, shift_type: str, labels: Optional[Dict] = None) -> Shift:
        """Create a shift in database"""
        shift = Shift(
            user_id=user_id,
            post_id=post_id,
            start=start,
            end=end,
            shift_type=shift_type,
            labels=labels or {}
        )
        
        self.db.add(shift)
        self.db.commit()
        self.db.refresh(shift)
        
        return shift
    
    def update_shift(self, shift_id: int, **kwargs) -> Optional[Shift]:
        """Update a shift"""
        shift = self.db.query(Shift).filter(Shift.id == shift_id).first()
        if not shift:
            return None
        
        for key, value in kwargs.items():
            if value is not None and hasattr(shift, key):
                setattr(shift, key, value)
        
        self.db.commit()
        self.db.refresh(shift)
        return shift
    
    def delete_shift(self, shift_id: int) -> bool:
        """Delete a shift"""
        shift = self.db.query(Shift).filter(Shift.id == shift_id).first()
        if not shift:
            return False
        
        self.db.delete(shift)
        self.db.commit()
        return True
    
    def generate_roster(self, month: int, year: int, post_ids: List[int], 
                       calls_per_night: int = 1) -> Dict:
        """Generate roster for a month using the engine"""
        # Sync engine with current DB state
        self.sync_engine_from_db()
        
        # Generate night calls
        result = self.engine.generate_night_calls(
            month=month,
            year=year,
            post_ids=post_ids,
            calls_per_night=calls_per_night
        )
        
        # Persist generated shifts to database
        created_shifts = []
        for engine_shift in self.engine.shifts:
            # Check if shift already exists
            existing = self.db.query(Shift).filter(
                Shift.user_id == engine_shift.user_id,
                Shift.start == engine_shift.start,
                Shift.end == engine_shift.end
            ).first()
            
            if not existing:
                shift = self.create_shift(
                    user_id=engine_shift.user_id,
                    post_id=engine_shift.post_id,
                    start=engine_shift.start,
                    end=engine_shift.end,
                    shift_type=engine_shift.shift_type,
                    labels=engine_shift.labels
                )
                created_shifts.append(shift)
        
        result['shifts_created'] = created_shifts
        return result
    
    def validate_ewtd(self, user_id: Optional[int] = None) -> Dict:
        """Validate EWTD compliance"""
        self.sync_engine_from_db()
        return self.engine.validate_roster(user_id)
    
    def import_csv(self, csv_content: str) -> Dict:
        """Import roster from CSV"""
        # Get user and post maps
        users = self.db.query(User).all()
        posts = self.db.query(Post).all()
        
        user_map = create_user_map(users)
        post_map = create_post_map(posts)
        
        # Parse CSV
        importer = RosterImporter(user_map, post_map)
        roster_data = importer.parse_csv(csv_content)
        
        if importer.errors:
            return {
                'imported': 0,
                'errors': importer.errors,
                'shifts': []
            }
        
        # Validate
        valid_data, validation_errors = importer.validate_roster_data(roster_data)
        
        # Create shifts
        created_shifts = []
        for item in valid_data:
            shift = self.create_shift(
                user_id=item['user_id'],
                post_id=item['post_id'],
                start=datetime.fromisoformat(item['start']),
                end=datetime.fromisoformat(item['end']),
                shift_type=item['type'],
                labels=item.get('labels', {})
            )
            created_shifts.append(shift)
        
        return {
            'imported': len(created_shifts),
            'errors': validation_errors,
            'shifts': created_shifts
        }
