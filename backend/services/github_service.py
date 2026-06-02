import requests

def get_repo_data(repo_url):

    parts = repo_url.rstrip("/").split("/")

    owner = parts[-2]
    repo = parts[-1]

    url = f"https://api.github.com/repos/{owner}/{repo}"

    response = requests.get(url)

    data = response.json()

    return {
    "name": data["name"],
    "fullName": data["full_name"],
    "description": data["description"],
    "url": data["html_url"],

    "stars": data["stargazers_count"],
    "forks": data["forks_count"],
    "watchers": data["watchers_count"],
    "openIssues": data["open_issues_count"],

    "language": data["language"],

    "license": (
        data["license"]["name"]
        if data.get("license")
        else "Unknown"
    ),

    "createdAt": data["created_at"],
    "updatedAt": data["updated_at"],

    "owner": {
        "login": data["owner"]["login"],
        "avatarUrl": data["owner"]["avatar_url"]
    },

    "topics": data.get("topics", []),

    "languages": {
        data["language"]: 100
    },

    "hasCI": False,
    "hasDocker": False,
    "hasTests": False
}