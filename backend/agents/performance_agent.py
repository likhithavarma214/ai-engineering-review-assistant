from services.ollama_service import ask_llm

def performance_review(repo):

    prompt = f"""
Analyze performance risks.

Repository:
{repo}

Provide:

- Bottlenecks
- Optimization opportunities
- Caching suggestions
"""
    return ask_llm(prompt)