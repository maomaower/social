// backend/app/routers/auth.py
import os
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..core.database import get_session
from ..models import User

router = APIRouter()

@router.post("/login")
def login(username: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        user = User(username=username)
        session.add(user)
        session.commit()
        session.refresh(user)
    return {"user_id": user.id, "username": user.username}
