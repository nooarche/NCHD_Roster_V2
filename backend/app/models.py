from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, ForeignKey, Table
from sqlalchemy.orm import relationship
# from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from .db import Base

# Association table for Post-Group many-to-many
post_group = Table(
    'post_group',
    Base.metadata,
    Column('post_id', Integer, ForeignKey('posts.id'), primary_key=True),
    Column('group_id', Integer, ForeignKey('groups.id'), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    grade = Column(String)  # Registrar, SHO, Intern, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    shifts = relationship("Shift", back_populates="user")
    leave_periods = relationship("Leave", back_populates="user")

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    site = Column(String)
    grade = Column(String)
    fte = Column(Float, default=1.0)
    status = Column(String, default="ACTIVE_ROSTERABLE")
    core_hours = Column(JSON, default={})
    eligibility = Column(JSON, default={})
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    groups = relationship("Group", secondary=post_group, back_populates="posts")
    shifts = relationship("Shift", back_populates="post")

class Group(Base):
    __tablename__ = 'groups'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    kind = Column(String, nullable=False)  # on_call_pool, protected_teaching, clinic_team
    rules = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    posts = relationship("Post", secondary=post_group, back_populates="groups")
    activities = relationship("Activity", back_populates="group")

class Activity(Base):
    __tablename__ = 'activities'
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey('groups.id'))
    name = Column(String, nullable=False)
    kind = Column(String)  # weekly, one_off
    pattern = Column(JSON, default={})
    
    # Relationships
    group = relationship("Group", back_populates="activities")

class Shift(Base):
    """Represents an assigned shift/duty period"""
    __tablename__ = 'shifts'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False, index=True)
    
    start = Column(DateTime, nullable=False, index=True)
    end = Column(DateTime, nullable=False)
    shift_type = Column(String, nullable=False)  # base, day_call, night_call, teaching, supervision
    
    labels = Column(JSON, default={})  # Additional metadata (paid_break, notes, etc.)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="shifts")
    post = relationship("Post", back_populates="shifts")
    
    def duration_hours(self):
        return (self.end - self.start).total_seconds() / 3600.0

class Leave(Base):
    """Represents leave periods for users"""
    __tablename__ = 'leave'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    
    start = Column(DateTime, nullable=False)
    end = Column(DateTime, nullable=False)
    leave_type = Column(String)  # annual, sick, study, etc.
    status = Column(String, default="approved")  # pending, approved, rejected
    notes = Column(String)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="leave_periods")
