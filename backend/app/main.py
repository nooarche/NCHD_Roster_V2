from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
from sqlalchemy.exc import OperationalError

from .db import engine, Base, SessionLocal
from .seed import seed

# Import routers
from .routers import posts_router, groups_router
from .routers.roster import router as roster_router  # NEW!

app = FastAPI(title="NCHD Rostering & Leave System API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(posts_router)    # /posts
app.include_router(groups_router)   # /groups
app.include_router(roster_router)   # /roster - NEW!

@app.get("/health")
def health():
    return {"ok": True, "version": "0.2.0"}

@app.on_event("startup")
def on_startup():
    # retry for DB readiness (max ~30s)
    for _ in range(30):
        try:
            Base.metadata.create_all(bind=engine)
            break
        except OperationalError:
            time.sleep(1)
    else:
        Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()
