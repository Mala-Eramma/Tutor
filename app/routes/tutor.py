from fastapi import APIRouter, Form, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import QuestionHistory
from app.services.ai_services import get_ai_response

from fastapi.templating import Jinja2Templates


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/ask")
def ask_question(
    question: str = Form(...),
    db: Session = Depends(get_db)
):
    answer = get_ai_response(question)

    history = QuestionHistory(
        question=question,
        answer=answer
    )

    db.add(history)
    db.commit()

    return {
        "question": question,
        "answer": answer
    }


@router.get("/history", response_class=HTMLResponse)
def get_history(
    request: Request,
    db: Session = Depends(get_db)
):
    history = (
        db.query(QuestionHistory)
        .order_by(QuestionHistory.id.desc())
        .all()
    )

    return templates.TemplateResponse(
        "history.html",
        {
            "request": request,
            "history": history
        }
    )


@router.post("/history/delete/{history_id}")
def delete_history(
    history_id: int,
    db: Session = Depends(get_db)
):
    history = (
        db.query(QuestionHistory)
        .filter(QuestionHistory.id == history_id)
        .first()
    )

    if history:
        db.delete(history)
        db.commit()

    return RedirectResponse(
        url="/history?deleted=1",
        status_code=303
    )