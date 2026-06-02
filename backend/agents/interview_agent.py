from services.ollama_service import ask_llm

def interview_questions(repo):

    prompt = f"""
Generate 10 interview questions.

Repository:
{repo}
"""
    return ask_llm(prompt)