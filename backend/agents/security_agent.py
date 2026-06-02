from services.ollama_service import ask_llm

def security_review(repo):

    prompt = f"""
Act as a Security Architect.

Repository:
{repo}

Provide:

- Security Risks
- OWASP Concerns
- Recommendations
"""

    return ask_llm(prompt)