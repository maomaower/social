
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..core.database import get_session
from ..models import Post, User

router = APIRouter()

@router.get("/")
def list_posts(session: Session = Depends(get_session)):
    posts = session.exec(select(Post).order_by(Post.id.desc())).all()
    return posts

@router.post("/")
def create_post(content: str, user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    post = Post(content=content, author_id=user_id)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

@router.post("/{post_id}/like")
def like_post(post_id: int, session: Session = Depends(get_session)):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.likes += 1
    session.add(post)
    session.commit()
    return {"post_id": post.id, "likes": post.likes}
