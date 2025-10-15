from datetime import datetime, timedelta, date, time
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass

# Canonical shift timings per spec (simplified; production should read from config)
SHIFT_DEFS = {
    ("base", "Mon-Thu"): (time(9,0), time(17,0)),
    ("base", "Fri"): (time(9,0), time(16,0)),
    ("day_call", "Mon-Thu"): (time(9,0), time(17,0)),
    ("day_call", "Fri"): (time(9,0), time(13,0)),
    ("night_call", "Mon-Thu"): (time(17,0), time(9,0)),
    ("night_call", "Fri"): (time(13,0), time(11,0)),
    ("night_call", "Sat"): (time(11,0), time(10,0)),
    ("night_call", "Sun"): (time(10,0), time(9,0)),
}

PROTECTED_TEACHING = (time(14,0), time(16,30))
HANDOVER_BLOCKS = [(time(16,30), time(17,0)), (time(9,0), time(9,30))]

@dataclass
class UserConstraints:
    user_id: int
    max_nights_per_month: int = 7
    min_rest_hours: int = 11
    max_consecutive_nights: int = 3
    opd_days: set = None
    leave_periods: List[Tuple[datetime, datetime]] = None
    
    def __post_init__(self):
        if self.opd_days is None:
            self.opd_days = set()
        if self.leave_periods is None:
            self.leave_periods = []

@dataclass
class Shift:
    user_id: int
    post_id: int
    start: datetime
    end: datetime
    shift_type: str
    labels: Dict = None
    
    def __post_init__(self):
        if self.labels is None:
            self.labels = {}

class RosterEngine:
    """Main roster generation engine"""
    
    def __init__(self):
        self.shifts: List[Shift] = []
        self.user_constraints: Dict[int, UserConstraints] = {}
    
    def import_existing_roster(self, roster_data: List[Dict], user_constraints: Dict[int, UserConstraints]):
        """Import existing shifts and constraints"""
        self.user_constraints = user_constraints
        for shift_dict in roster_data:
            shift = Shift(
                user_id=shift_dict['user_id'],
                post_id=shift_dict['post_id'],
                start=shift_dict['start'],
                end=shift_dict['end'],
                shift_type=shift_dict['type'],
                labels=shift_dict.get('labels', {})
            )
            self.shifts.append(shift)
    
    def generate_night_calls(self, month: int, year: int, post_ids: List[int], 
                            calls_per_night: int = 1) -> Dict:
        """Generate night call shifts for a month"""
        from calendar import monthrange
        
        _, num_days = monthrange(year, month)
        assigned = 0
        unassigned_dates = []
        
        # Simple round-robin assignment
        user_ids = list(self.user_constraints.keys())
        if not user_ids:
            return {
                'assigned': 0,
                'unassigned_dates': list(range(1, num_days + 1)),
                'total_nights': num_days
            }
        
        user_idx = 0
        for day in range(1, num_days + 1):
            for _ in range(calls_per_night):
                if user_idx < len(user_ids):
                    user_id = user_ids[user_idx % len(user_ids)]
                    post_id = post_ids[0] if post_ids else 1
                    
                    start = datetime(year, month, day, 17, 0)
                    end = datetime(year, month, day + 1 if day < num_days else 1, 9, 0)
                    
                    shift = Shift(
                        user_id=user_id,
                        post_id=post_id,
                        start=start,
                        end=end,
                        shift_type='night_call'
                    )
                    self.shifts.append(shift)
                    assigned += 1
                    user_idx += 1
                else:
                    unassigned_dates.append(day)
        
        return {
            'assigned': assigned,
            'unassigned_dates': unassigned_dates,
            'total_nights': num_days
        }
    
    def validate_roster(self, user_id: Optional[int] = None) -> Dict:
        """Validate EWTD compliance"""
        violations = []
        warnings = []
        
        shifts_to_check = [s for s in self.shifts if user_id is None or s.user_id == user_id]
        
        for shift in shifts_to_check:
            duration = (shift.end - shift.start).total_seconds() / 3600
            
            if duration > 24:
                violations.append(f"User {shift.user_id}: Shift exceeds 24 hours ({duration:.1f}h)")
            
            if duration < 1:
                warnings.append(f"User {shift.user_id}: Very short shift ({duration:.1f}h)")
        
        # Check night call limits
        if user_id:
            night_shifts = [s for s in shifts_to_check if s.shift_type == 'night_call']
            constraint = self.user_constraints.get(user_id)
            if constraint and len(night_shifts) > constraint.max_nights_per_month:
                violations.append(
                    f"User {user_id}: Exceeds max night calls "
                    f"({len(night_shifts)} > {constraint.max_nights_per_month})"
                )
        
        return {
            'compliant': len(violations) == 0,
            'violations': violations,
            'warnings': warnings
        }

def ewtd_check(daily_records: List[Tuple[datetime, datetime, str]]) -> Dict[str, bool]:
    """Basic EWTD (European Working Time Directive) checks"""
    ok = True
    reasons = []

    for start, end, t in daily_records:
        duration = (end - start).total_seconds() / 3600.0
        if duration > 24.0:
            ok = False
            reasons.append(f"Duty exceeds 24h: {duration:.1f}h")

    return {"ok": ok, "reasons": reasons}

def fairness_score(assignments: List[Tuple[int, float]]) -> float:
    """Simple fairness proxy: stddev of on-call hours per user (lower is better)"""
    import statistics
    hours = [h for _, h in assignments] or [0.0]
    return statistics.pstdev(hours)
