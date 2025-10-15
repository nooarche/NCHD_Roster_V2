from typing import List, Dict, Tuple
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def create_user_map(users) -> Dict[str, int]:
    """Create mapping from user names to user IDs"""
    user_map = {}
    for user in users:
        # Map by name
        user_map[user.name.lower()] = user.id
        # Also map by email
        if user.email:
            user_map[user.email.lower()] = user.id
    return user_map

def create_post_map(posts) -> Dict[str, int]:
    """Create mapping from post titles to post IDs"""
    post_map = {}
    for post in posts:
        post_map[post.title.lower()] = post.id
    return post_map

class RosterImporter:
    """Handles importing roster data from CSV"""
    
    def __init__(self, user_map: Dict[str, int], post_map: Dict[str, int]):
        self.user_map = user_map
        self.post_map = post_map
        self.errors = []
    
    def parse_csv(self, csv_content: str) -> List[Dict]:
        """Parse CSV content into roster data"""
        lines = csv_content.strip().split('\n')
        if not lines:
            self.errors.append("CSV file is empty")
            return []
        
        # Parse header
        header = [h.strip().lower() for h in lines[0].split(',')]
        
        # Validate required columns
        required = ['name', 'post', 'date', 'type']
        missing = [r for r in required if r not in header]
        if missing:
            self.errors.append(f"Missing required columns: {', '.join(missing)}")
            return []
        
        roster_data = []
        for i, line in enumerate(lines[1:], start=2):
            if not line.strip():
                continue
            
            values = [v.strip() for v in line.split(',')]
            if len(values) != len(header):
                self.errors.append(f"Line {i}: Column count mismatch")
                continue
            
            row = dict(zip(header, values))
            
            # Map user
            user_key = row['name'].lower()
            if user_key not in self.user_map:
                self.errors.append(f"Line {i}: User '{row['name']}' not found")
                continue
            
            # Map post
            post_key = row['post'].lower()
            if post_key not in self.post_map:
                self.errors.append(f"Line {i}: Post '{row['post']}' not found")
                continue
            
            # Parse date and times
            try:
                date_str = row['date']
                start_time = row.get('start_time', '09:00')
                end_time = row.get('end_time', '17:00')
                
                start = datetime.fromisoformat(f"{date_str} {start_time}")
                end = datetime.fromisoformat(f"{date_str} {end_time}")
                
                roster_data.append({
                    'user_id': self.user_map[user_key],
                    'post_id': self.post_map[post_key],
                    'start': start.isoformat(),
                    'end': end.isoformat(),
                    'type': row['type'].lower().replace(' ', '_'),
                    'labels': {}
                })
            except Exception as e:
                self.errors.append(f"Line {i}: Date/time parse error: {str(e)}")
                continue
        
        return roster_data
    
    def validate_roster_data(self, roster_data: List[Dict]) -> Tuple[List[Dict], List[str]]:
        """Validate roster data for EWTD compliance"""
        valid_data = []
        errors = []
        
        for item in roster_data:
            try:
                start = datetime.fromisoformat(item['start'])
                end = datetime.fromisoformat(item['end'])
                
                duration = (end - start).total_seconds() / 3600
                
                if duration > 24:
                    errors.append(
                        f"User {item['user_id']}: Shift exceeds 24 hours ({duration:.1f}h)"
                    )
                    continue
                
                if duration < 0:
                    errors.append(
                        f"User {item['user_id']}: End time before start time"
                    )
                    continue
                
                valid_data.append(item)
            except Exception as e:
                errors.append(f"Validation error: {str(e)}")
        
        return valid_data, errors
