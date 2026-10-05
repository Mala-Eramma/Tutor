from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class QuestionHistory(Base):
    __tablename__ = "question_history"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    mode = Column(String(20), default="text")