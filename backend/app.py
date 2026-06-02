from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from services.github_service import get_repo_data

from agents.architecture_agent import architecture_review
from agents.security_agent import security_review
from agents.cloud_agent import cloud_review
from agents.performance_agent import performance_review
from agents.interview_agent import interview_questions
from agents.resume_agent import resume_bullets

from services.scoring_service import calculate_scores

app = FastAPI(
    title="AI Engineering Review Assistant"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class RepoRequest(BaseModel):
    repo_url: str

@app.post("/api/analyze")
def analyze_repo(request: RepoRequest):

    repo = get_repo_data(
        request.repo_url
    )

    architecture = architecture_review(repo)

    security = security_review(repo)

    cloud = cloud_review(repo)

    performance = performance_review(repo)

    questions = interview_questions(repo)

    bullets = resume_bullets(repo)

    scores = calculate_scores(
        repo
    )

    return {
        "repository": repo,
        "scores": scores,
        "reviews": {
            "architecture": architecture,
            "security": security,
            "cloud": cloud,
            "performance": performance
        },
        "interviewQuestions": questions,
        "resumeBullets": bullets
    }