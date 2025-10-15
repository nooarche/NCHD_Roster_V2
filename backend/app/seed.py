from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from .models import User, Post, Group, Shift

def seed(db: Session):
    """Seed database with initial data"""
    
    # Check if already seeded
    if db.query(User).count() > 0:
        return
    
    print("Seeding database...")
    
    # Create users
    users = [
        User(id=1, name="Dr. Jawaria Akhtar", email="jawaria@example.com", grade="Registrar"),
        User(id=2, name="Dr. Lucy O'Sullivan", email="lucy@example.com", grade="BST Trainee"),
        User(id=3, name="Dr. Holly Kehoe", email="holly@example.com", grade="BST Trainee"),
        User(id=4, name="Dr. Andrea Moloney", email="andrea@example.com", grade="GP Trainee"),
        User(id=5, name="Dr. Mian Ahmed", email="mian@example.com", grade="Registrar"),
    ]
    db.add_all(users)
    
    # Create posts
    posts = [
        Post(
            id=1,
            title="DLHG 1",
            site="Dun Laoghaire",
            grade="Registrar",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours={
                "MON": [["09:00", "17:00"]],
                "TUE": [["09:00", "17:00"]],
                "WED": [["09:00", "17:00"]],
                "THU": [["09:00", "17:00"]],
                "FRI": [["09:00", "16:00"]],
            },
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7
                }
            }
        ),
        Post(
            id=2,
            title="Edyta 1 BST Trainee",
            site="Edyta",
            grade="BST Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours={
                "MON": [["09:00", "17:00"]],
                "WED": [["09:00", "17:00"]],
                "FRI": [["09:00", "17:00"]],
            },
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7
                }
            }
        ),
        Post(
            id=3,
            title="Greystones 1 BST Trainee",
            site="Greystones",
            grade="BST Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
        ),
    ]
    db.add_all(posts)
    
    # Create groups
    groups = [
        Group(
            id=1,
            name="Newcastle 24h Pool",
            kind="on_call_pool",
            rules={
                "shifts": [
                    {
                        "name": "Day Call",
                        "window": ["09:00", "17:00"],
                        "days": ["MON", "TUE", "WED", "THU", "FRI"]
                    },
                    {
                        "name": "Night Call",
                        "window": ["17:00", "09:00+1"],
                        "days": ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
                    }
                ],
                "caps": {
                    "max_nights_per_month": 7,
                    "min_rest_hours": 11
                }
            }
        )
    ]
    db.add_all(groups)
    
    # Create some sample shifts
    base_date = datetime(2025, 7, 14)
    shifts = [
        Shift(
            user_id=1,
            post_id=1,
            start=base_date.replace(hour=9),
            end=base_date.replace(hour=17),
            shift_type="day_call"
        ),
        Shift(
            user_id=2,
            post_id=2,
            start=base_date.replace(hour=17),
            end=(base_date + timedelta(days=1)).replace(hour=9),
            shift_type="night_call"
        ),
        Shift(
            user_id=3,
            post_id=3,
            start=(base_date + timedelta(days=1)).replace(hour=9),
            end=(base_date + timedelta(days=1)).replace(hour=17),
            shift_type="base"
        ),
    ]
    db.add_all(shifts)
    
    db.commit()
    print("Database seeded successfully!")
