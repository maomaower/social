from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    posts: List["Post"] = Relationship(back_populates="author")

class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    likes: int = Field(default=0)
    author_id: int = Field(foreign_key="user.id")
    author: Optional[User] = Relationship(back_populates="posts")
