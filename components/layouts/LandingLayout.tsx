"use client";
import React, { useEffect } from "react";
import Script from "next/script";

interface GithubRepo {
  name: string;
  stargazers_count: number;
}

interface GithubResponse {
  items: GithubRepo[];
}

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({
  children,
}: LandingLayoutProps) {
  useEffect(() => {
    // Client-side only code for fetching GitHub stars
    const fetchGitHubStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/search/repositories?q=user:apis-guru%20user:Redocly&sort=stars&per_page=10",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) return;

        const data = (await response.json()) as GithubResponse;
        data.items.forEach((repoInfo) => {
          const name = repoInfo.name;
          const stars = repoInfo.stargazers_count;
          const starEls = document.querySelectorAll(
            `[data-proj="${name}"].stars-count`
          );
          starEls.forEach((el) => {
            if (el) el.textContent = stars.toString();
          });
        });
      } catch (error) {
        console.error("Error fetching GitHub stars:", error);
      }
    };

    fetchGitHubStars();
  }, []);

  return (
    <>
      <div className="landing-layout">{children}</div>

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" />
      <Script
        src="https://d1ml0gfpm9yj9s.cloudfront.net/scrollIt.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery.sticky/1.0.4/jquery.sticky.min.js"
        strategy="afterInteractive"
      />

      <Script id="sticky-header" strategy="lazyOnload">
        {`
          if (typeof $ !== 'undefined') {
            $('#main_header').sticky({ topSpacing: 0, widthFromWrapper: true, responsiveWidth: true });

            $.scrollIt({
              easing: 'easy-in',
              scrollTime: 600,
              topOffset: -70
            });
          }
        `}
      </Script>
    </>
  );
}
