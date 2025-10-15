from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ..db import get_db
from ..models import Shift, User, Post
from ..schemas.roster import (
    ShiftCreate, ShiftUpdate, ShiftResponse, ShiftListResponse,
    GenerateRosterRequest, GenerateRosterResponse,
    EWTDValidationResponse, ImportCSVRequest, ImportCSVResponse
)
from ..services.roster_service import RosterService

router = APIRouter(prefix="/roster", tags=["roster"])

@router.get("/shifts", response_model=ShiftListResponse)
def list_shifts(
    user_id: Optional[int] = Query(None),
    post_id: Optional[int] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """List shifts with optional filtering"""
    query = db.query(Shift)
    
    if user_id:
        query = query.filter(Shift.user_id == user_id)
    if post_id:
        query = query.filter(Shift.post_id == post_id)
    if start_date:
        query = query.filter(Shift.start >= start_date)
    if end_date:
        query = query.filter(Shift.end <= end_date)
    
    total = query.count()
    shifts = query.offset(skip).limit(limit).all()
    
    return ShiftListResponse(shifts=shifts, total=total)

@router.post("/shifts", response_model=ShiftResponse, status_code=201)
def create_shift(shift_data: ShiftCreate, db: Session = Depends(get_db)):
    """Create a new shift"""
    # Verify user and post exist
    user = db.query(User).filter(User.id == shift_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    post = db.query(Post).filter(Post.id == shift_data.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Create shift using service
    service = RosterService(db)
    shift = service.create_shift(
        user_id=shift_data.user_id,
        post_id=shift_data.post_id,
        start=shift_data.start,
        end=shift_data.end,
        shift_type=shift_data.shift_type,
        labels=shift_data.labels
    )
    
    return shift

@router.get("/shifts/{shift_id}", response_model=ShiftResponse)
def get_shift(shift_id: int, db: Session = Depends(get_db)):
    """Get a specific shift"""
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    return shift

@router.put("/shifts/{shift_id}", response_model=ShiftResponse)
def update_shift(shift_id: int, shift_data: ShiftUpdate, db: Session = Depends(get_db)):
    """Update a shift"""
    service = RosterService(db)
    shift = service.update_shift(shift_id, **shift_data.dict(exclude_unset=True))
    
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    return shift

@router.delete("/shifts/{shift_id}")
def delete_shift(shift_id: int, db: Session = Depends(get_db)):
    """Delete a shift"""
    service = RosterService(db)
    success = service.delete_shift(shift_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    return {"ok": True}

@router.post("/generate", response_model=GenerateRosterResponse)
def generate_roster(request: GenerateRosterRequest, db: Session = Depends(get_db)):
    """Generate roster for a month"""
    # Verify all posts exist
    posts = db.query(Post).filter(Post.id.in_(request.post_ids)).all()
    if len(posts) != len(request.post_ids):
        raise HTTPException(status_code=404, detail="One or more posts not found")
    
    service = RosterService(db)
    result = service.generate_roster(
        month=request.month,
        year=request.year,
        post_ids=request.post_ids,
        calls_per_night=request.calls_per_night
    )
    
    return GenerateRosterResponse(
        assigned=result['assigned'],
        unassigned_dates=[str(d) for d in result['unassigned_dates']],
        total_nights=result['total_nights'],
        shifts_created=result['shifts_created']
    )

@router.get("/validate", response_model=EWTDValidationResponse)
@router.get("/validate/{user_id}", response_model=EWTDValidationResponse)
def validate_ewtd(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Validate EWTD compliance for all users or specific user"""
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    
    service = RosterService(db)
    result = service.validate_ewtd(user_id)
    
    return EWTDValidationResponse(
        compliant=result['compliant'],
        violations=result['violations'],
        warnings=result.get('warnings', [])
    )

@router.post("/import-csv", response_model=ImportCSVResponse)
def import_csv(request: ImportCSVRequest, db: Session = Depends(get_db)):
    """Import roster from CSV"""
    service = RosterService(db)
    result = service.import_csv(request.csv_content)
    
    return ImportCSVResponse(
        imported=result['imported'],
        errors=result['errors'],
        shifts=result['shifts']
    )
