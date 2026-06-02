from services.ollama_service import ask_llm

def resume_bullets(repo):

    prompt = f"""
Generate resume bullet points.

Repository:
{repo}
"""
    return ask_llm(prompt)