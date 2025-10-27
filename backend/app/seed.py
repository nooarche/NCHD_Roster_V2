from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models import User, Post, Group, Shift

def seed(db: Session):
    """Seed database with initial data from real NCHD posts"""
    
    # Check if already seeded
    if db.query(Post).count() > 0:
        print("Database already seeded, skipping...")
        return
    
    print("Seeding database with 14 NCHD posts...")
    
    # Core hours template (same for all posts)
    CORE_HOURS = {
        "MON": [["09:00", "17:00"]],
        "TUE": [["09:00", "17:00"]],
        "WED": [["09:00", "17:00"]],  # Note: 14:00-17:00 is protected teaching
        "THU": [["09:00", "17:00"]],
        "FRI": [["09:00", "16:00"]],
    }
    
    # Protected teaching (Wednesday 14:00-17:00) - applies to all NCHDs
    PROTECTED_TEACHING = {
        "day": "WED",
        "start": "14:00",
        "end": "17:00",
        "type": "group_teaching",
        "mandatory": True,
        "except_day_caller": True  # Day caller on Wednesday doesn't attend
    }
    
    # Create 14 NCHD posts from CSV data
    posts = [
        # 1. DDLHG 1 BST Trainee
        Post(
            title="DDLHG 1 BST Trainee",
            site="Dun Laoghaire",
            grade="BST Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["MON", "WED", "FRI"],
                    "night_call_preference_days": ["TUE", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": ["TUE", "THU"],
                    "blocks_day_call": True,
                    "blocks_night_call_before": True,
                    "notes": "OPD clinics Tuesday & Thursday"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Dun Laoghaire BST position with Tuesday & Thursday clinics"
        ),
        
        # 2. DDLHG 2 GP Trainee
        Post(
            title="DDLHG 2 GP Trainee",
            site="Dun Laoghaire",
            grade="GP Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["MON", "WED", "FRI"],
                    "night_call_preference_days": ["TUE", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": ["TUE", "THU"],
                    "blocks_day_call": True,
                    "blocks_night_call_before": True,
                    "notes": "OPD clinics Tuesday & Thursday"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Dun Laoghaire GP position (4-month rotation)"
        ),
        
        # 3. Edyta 1 BST Trainee
        Post(
            title="Edyta 1 BST Trainee",
            site="St Columcille's (Edyta)",
            grade="BST Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["MON", "WED", "FRI"],
                    "night_call_preference_days": ["TUE", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": ["TUE", "THU"],
                    "blocks_day_call": True,
                    "blocks_night_call_before": True,
                    "notes": "OPD clinics Tuesday & Thursday"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="St Columcille's BST position"
        ),
        
        # 4. Edyta 2 GP Trainee
        Post(
            title="Edyta 2 GP Trainee",
            site="St Columcille's (Edyta)",
            grade="GP Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["MON", "WED", "FRI"],
                    "night_call_preference_days": ["TUE", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": ["TUE", "THU"],
                    "blocks_day_call": True,
                    "blocks_night_call_before": True,
                    "notes": "OPD clinics Tuesday & Thursday"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="St Columcille's GP position (4-month rotation)"
        ),
        
        # 5. Greystones 1 BST Trainee
        Post(
            title="Greystones 1 BST Trainee",
            site="Greystones",
            grade="BST Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["MON", "WED", "FRI"],
                    "night_call_preference_days": ["TUE", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": ["TUE", "THU"],
                    "blocks_day_call": True,
                    "blocks_night_call_before": True,
                    "notes": "OPD clinics Tuesday & Thursday"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Greystones BST position"
        ),
        
        # 6. Greystones 2 GP Trainee
        Post(
            title="Greystones 2 GP Trainee",
            site="Greystones",
            grade="GP Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["MON", "WED", "FRI"],
                    "night_call_preference_days": ["TUE", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": ["TUE", "THU"],
                    "blocks_day_call": True,
                    "blocks_night_call_before": True,
                    "notes": "OPD clinics Tuesday & Thursday"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Greystones GP position (4-month rotation)"
        ),
        
        # 7. Rehab BST Trainee
        Post(
            title="Rehab BST Trainee",
            site="Rehabilitation Unit",
            grade="BST Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["THU", "FRI"],
                    "night_call_preference_days": ["WED"]
                },
                "clinic_constraints": {
                    "opd_days": ["MON", "TUE"],
                    "blocks_day_call": True,
                    "blocks_night_call_before": True,
                    "notes": "OPD clinics Monday & Tuesday"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Rehabilitation unit position"
        ),
        
        # 8. MHID BST Trainee
        Post(
            title="MHID BST Trainee",
            site="Mental Health Intellectual Disability",
            grade="BST Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["TUE", "FRI"],
                    "night_call_preference_days": ["MON", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": [],  # Unknown from CSV
                    "blocks_day_call": False,
                    "blocks_night_call_before": False,
                    "notes": "Clinic days TBD"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="MHID position - clinic days to be confirmed"
        ),
        
        # 9. POA BST Trainee
        Post(
            title="POA BST Trainee",
            site="Psychiatry of Old Age",
            grade="BST Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["WED", "THU"],
                    "night_call_preference_days": ["WED", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": [],  # Unknown from CSV
                    "blocks_day_call": False,
                    "blocks_night_call_before": False,
                    "notes": "Clinic days TBD"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Psychiatry of Old Age position - clinic days to be confirmed"
        ),
        
        # 10. Wicklow 1 BST Trainee
        Post(
            title="Wicklow 1 BST Trainee",
            site="Wicklow",
            grade="BST Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["MON", "THU", "FRI"],
                    "night_call_preference_days": ["WED", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": ["TUE", "WED"],
                    "blocks_day_call": True,
                    "blocks_night_call_before": True,
                    "notes": "OPD clinics Tuesday & Wednesday"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Wicklow BST position"
        ),
        
        # 11. Wicklow 2 GP Trainee
        Post(
            title="Wicklow 2 GP Trainee",
            site="Wicklow",
            grade="GP Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["MON", "THU", "FRI"],
                    "night_call_preference_days": ["WED", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": ["TUE", "WED"],
                    "blocks_day_call": True,
                    "blocks_night_call_before": True,
                    "notes": "OPD clinics Tuesday & Wednesday"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Wicklow GP position (4-month rotation)"
        ),
        
        # 12. Arklow 1 BST Trainee
        Post(
            title="Arklow 1 BST Trainee",
            site="Arklow",
            grade="BST Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["TUE", "FRI"],
                    "night_call_preference_days": ["MON", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": [],  # Unknown from CSV
                    "blocks_day_call": False,
                    "blocks_night_call_before": False,
                    "notes": "Clinic days TBD"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Arklow BST position - clinic days to be confirmed"
        ),
        
        # 13. Arklow 2 GP Trainee
        Post(
            title="Arklow 2 GP Trainee",
            site="Arklow",
            grade="GP Trainee",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": ["TUE", "FRI"],
                    "night_call_preference_days": ["MON", "THU"]
                },
                "clinic_constraints": {
                    "opd_days": [],  # Unknown from CSV
                    "blocks_day_call": False,
                    "blocks_night_call_before": False,
                    "notes": "Clinic days TBD"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Arklow GP position (4-month rotation) - clinic days to be confirmed"
        ),
        
        # 14. Gorey NCHD
        Post(
            title="Gorey NCHD",
            site="Gorey",
            grade="NCHD",
            fte=1.0,
            status="ACTIVE_ROSTERABLE",
            core_hours=CORE_HOURS,
            eligibility={
                "call_policy": {
                    "role": "NCHD",
                    "participates_in_call": True,
                    "min_rest_hours": 11,
                    "max_nights_per_month": 7,
                    "day_call_preference_days": [],  # No preference specified
                    "night_call_preference_days": ["MON"]
                },
                "clinic_constraints": {
                    "opd_days": [],  # Unknown from CSV
                    "blocks_day_call": False,
                    "blocks_night_call_before": False,
                    "notes": "Clinic days TBD"
                },
                "protected_time": PROTECTED_TEACHING
            },
            notes="Gorey NCHD position - details to be confirmed"
        ),
    ]
    
    db.add_all(posts)
    
    # Create on-call pool group
    group = Group(
        name="Community Psychiatry On-Call Pool",
        kind="on_call_pool",
        rules={
            "description": "14 NCHD posts across Community Psychiatry sites",
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
                "min_rest_hours": 11,
                "max_consecutive_nights": 3
            },
            "protected_time": {
                "teaching": "Wednesday 14:00-17:00 (except day caller)",
                "supervision": "Weekly off-call time TBD per NCHD"
            }
        }
    )
    db.add(group)
    
    db.commit()
    
    print("✅ Successfully seeded database with 14 NCHD posts!")
    print("   - All posts have protected teaching Wednesday 14:00-17:00")
    print("   - Core hours: Mon-Thu 9-5, Fri 9-4")
    print("   - Clinic day constraints applied where specified")
    print("   - Call preferences configured from CSV data")
    print("   - Posts with '?' clinic days can be updated later via UI")
