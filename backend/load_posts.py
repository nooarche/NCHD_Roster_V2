#!/usr/bin/env python3
"""
Load NCHD posts from JSON file into database
Usage: python load_posts.py
"""

import json
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.db import SessionLocal
from app.models import Post, User

def create_user_if_not_exists(db, name, email, grade):
    """Create a user if they don't exist"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            name=name,
            email=email,
            grade=grade
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"  ✓ Created user: {name}")
    return user

def load_posts_from_json(json_file='posts_data.json'):
    """Load posts from JSON file"""
    db = SessionLocal()
    
    try:
        # Load JSON data
        with open(json_file, 'r') as f:
            posts_data = json.load(f)
        
        print(f"📋 Loading {len(posts_data)} posts from {json_file}")
        print("=" * 60)
        
        created_count = 0
        updated_count = 0
        
        for idx, post_data in enumerate(posts_data, 1):
            title = post_data['title']
            
            # Check if post already exists
            existing_post = db.query(Post).filter(Post.title == title).first()
            
            # Build eligibility structure
            eligibility = {
                'call_policy': {
                    'role': 'NCHD',
                    'participates_in_call': True,
                    'min_rest_hours': 11,
                    'max_nights_per_month': 7,
                    'day_call_allowed_when_on_site': True,
                    'night_call_requires_next_day_rest': True,
                },
                'constraints': {
                    'max_consecutive_days': 6,
                    'min_rest_between_shifts_hours': 11,
                }
            }
            
            # Add clinic constraints if OPD days specified
            if post_data.get('opd_days'):
                eligibility['clinic_constraints'] = {
                    'opd_days': post_data['opd_days'],
                    'blocks_day_call': True,
                    'blocks_night_call_before': True,
                    'notes': post_data.get('notes', 'OPD clinic days')
                }
            
            if existing_post:
                # Update existing post
                existing_post.site = post_data['site']
                existing_post.grade = post_data['grade']
                existing_post.fte = post_data['fte']
                existing_post.status = post_data['status']
                existing_post.core_hours = post_data['core_hours']
                existing_post.eligibility = eligibility
                existing_post.notes = post_data.get('notes', '')
                
                db.commit()
                updated_count += 1
                print(f"{idx}. ✓ Updated: {title}")
            else:
                # Create new post
                post = Post(
                    title=title,
                    site=post_data['site'],
                    grade=post_data['grade'],
                    fte=post_data['fte'],
                    status=post_data['status'],
                    core_hours=post_data['core_hours'],
                    eligibility=eligibility,
                    notes=post_data.get('notes', '')
                )
                
                db.add(post)
                db.commit()
                db.refresh(post)
                created_count += 1
                print(f"{idx}. ✓ Created: {title}")
            
            # Show clinic constraints
            if post_data.get('opd_days'):
                print(f"   → OPD Days: {', '.join(post_data['opd_days'])}")
                print(f"   → Current: {post_data.get('current_holder', 'Vacant')}")
        
        print("=" * 60)
        print(f"✅ Complete! Created: {created_count}, Updated: {updated_count}")
        
        # Also create users for current holders
        print("\n👥 Creating/updating users...")
        users_created = 0
        seen_holders = set()
        
        for post_data in posts_data:
            holder = post_data.get('current_holder')
            if holder and holder not in seen_holders and holder != 'Vacant':
                email = holder.lower().replace(' ', '.') + '@hse.ie'
                create_user_if_not_exists(db, holder, email, post_data['grade'])
                seen_holders.add(holder)
                users_created += 1
        
        print(f"✅ Users: {users_created} processed")
        
    except FileNotFoundError:
        print(f"❌ Error: File '{json_file}' not found")
        print(f"   Please ensure the JSON file is in the same directory as this script")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        return False
    finally:
        db.close()
    
    return True

def list_posts():
    """List all posts in database"""
    db = SessionLocal()
    try:
        posts = db.query(Post).order_by(Post.id).all()
        print(f"\n📋 Current Posts in Database ({len(posts)} total)")
        print("=" * 80)
        
        for post in posts:
            opd_days = post.eligibility.get('clinic_constraints', {}).get('opd_days', []) if post.eligibility else []
            opd_str = f" [OPD: {', '.join(opd_days)}]" if opd_days else ""
            print(f"{post.id:2}. {post.title:40} | {post.site:15} | {post.grade:15}{opd_str}")
        
        print("=" * 80)
    finally:
        db.close()

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Load NCHD posts from JSON')
    parser.add_argument('--file', default='posts_data.json', help='JSON file to load')
    parser.add_argument('--list', action='store_true', help='List current posts')
    
    args = parser.parse_args()
    
    if args.list:
        list_posts()
    else:
        success = load_posts_from_json(args.file)
        if success:
            print("\n" + "=" * 60)
            list_posts()
        sys.exit(0 if success else 1)
