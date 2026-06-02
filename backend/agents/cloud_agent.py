from services.ollama_service import ask_llm

def cloud_review(repo):

    prompt = f"""
Act as AWS Cloud Architect.

Repository:
{repo}

Provide:

- AWS deployment plan
- Docker suggestions
- CI/CD suggestions
"""
    return ask_llm(prompt)