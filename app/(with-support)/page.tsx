import React from "react";
import SearchClientComponent from "@/components/SearchClientComponent";

interface GitHubRepo {
  name: string;
  stargazers_count: number;
}

async function fetchGitHubStars(): Promise<Record<string, number>> {
  try {
    const reposResponse = await fetch(
      "https://api.github.com/search/repositories?q=user:apis-guru%20user:Redocly&sort=stars&per_page=10",
      { next: { revalidate: 3600 } } // Revalidate every hour
    );
    const reposData = await reposResponse.json();
    const githubRepos: GitHubRepo[] = reposData.items || [];

    return githubRepos.reduce((acc: Record<string, number>, repo) => {
      acc[repo.name] = repo.stargazers_count;
      return acc;
    }, {});
  } catch (error) {
    console.error("Failed to fetch GitHub stars:", error);
    return {};
  }
}

export default async function Home() {
  const repoStarCounts = await fetchGitHubStars();

  return (
    <div className="container mx-auto px-4 py-4 relative">
      <div className="relative z-10">
        <SearchClientComponent repoStarCounts={repoStarCounts} />
      </div>
    </div>
  );
}
