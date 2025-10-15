from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, Dict, List

class ShiftBase(BaseModel):
    user_id: int
    post_id: int
    start: datetime
    end: datetime
    shift_type: str = Field(..., regex="^(base|day_call|night_call|teaching|supervision)$")
    labels: Optional[Dict] = {}

class ShiftCreate(ShiftBase):
    @validator('end')
    def end_after_start(cls, v, values):
        if 'start' in values and v <= values['start']:
            raise ValueError('end must be after start')
        return v
    
    @validator('shift_type')
    def validate_shift_type(cls, v):
        allowed = ['base', 'day_call', 'night_call', 'teaching', 'supervision']
        if v not in allowed:
            raise ValueError(f'shift_type must be one of {allowed}')
        return v

class ShiftUpdate(BaseModel):
    start: Optional[datetime]
    end: Optional[datetime]
    shift_type: Optional[str]
    labels: Optional[Dict]

class ShiftResponse(ShiftBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class ShiftListResponse(BaseModel):
    shifts: List[ShiftResponse]
    total: int

class GenerateRosterRequest(BaseModel):
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2020, le=2100)
    post_ids: List[int]
    calls_per_night: int = Field(1, ge=1, le=5)

class GenerateRosterResponse(BaseModel):
    assigned: int
    unassigned_dates: List[str]
    total_nights: int
    shifts_created: List[ShiftResponse]

class EWTDValidationResponse(BaseModel):
    compliant: bool
    violations: List[str]
    warnings: List[str]

class ImportCSVRequest(BaseModel):
    csv_content: str

class ImportCSVResponse(BaseModel):
    imported: int
    errors: List[str]
    shifts: List[ShiftResponse]
