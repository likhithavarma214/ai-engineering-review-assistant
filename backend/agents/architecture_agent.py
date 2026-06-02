from services.ollama_service import ask_llm

def architecture_review(repo):

    prompt = f"""
Review this repository architecture.

Repository:
{repo}

Provide:

1. Strengths
2. Weaknesses
3. Scalability
4. Recommendations
"""

    return ask_llm(prompt)