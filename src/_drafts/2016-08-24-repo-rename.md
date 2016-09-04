---
layout: post
date: 2016-08-24
title: "GitHub SEO: We changing name of our GitHub repo"
image: /assets/images/blog/repo-rename.png
---

> "There is nothing more permanent than a temporary solution".

You ask, why our main repo is called `api-models`?
It easy to explain `api` part but `models` is something strange and alien in this context.
So if you see `api-models` in search results you will never expect it is a collection of API **specs**.

But why we made this mistake then we create the repo?
Repo was just a temporary solution to a hosting problem until we build
website with full-feature back-end including DB to store our collection.
So we basically used first thing came to our mind, and didn't though it will have long-term consequences :(

But we feel it time to rip the plaster off:

![repo rename](/assets/images/blog/repo-rename.png)

<!--more-->

# API models VS API directory
How big is improve, let's try to google both term and see results:

![models vs directory](/assets/images/blog/repo-rename-google-models-vs-directory.png)

# But why "directory"?

Answer is simple we used Google Analytics to find what keywords are more popular:
![google trends](/assets/images/blog/repo-rename-google-trends.png)

# And what about "openapi"?

Right now there are a lot of hype around `OpenAPI specification` and since we used it as the primary format
we also want to ride the hype train. So if you search for `OpenAPI` on GitHub we want to be on the first page (4th page at the moment).
As far as we can tell GitHub sort search result by where the match occurs, in the project name, project description or inside `README.md`.
So placing right keywords in right keywords in right places is more important than number of stars, see screenshot:

![GitHub search](/assets/images/blog/github_search_openapi.png)

-----------------
What do you think about the new name? We like to hear your opinion in comments.
