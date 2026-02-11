# Reference: GitHub API

## Search Repositories
`GET https://api.github.com/search/repositories?q={query}`

Documentation: [GitHub Search API](https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories)

## Get Repository Content
`GET https://api.github.com/repos/{owner}/{repo}/contents/{path}`

Documentation: [GitHub Contents API](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content)

## Rate Limiting
- For unauthenticated requests, the rate limit allows for up to 60 requests per hour.
- For authenticated requests, you can make up to 5,000 requests per hour.
