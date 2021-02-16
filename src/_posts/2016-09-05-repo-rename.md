---
layout: post
date: 2016-09-05
title: "We change name of our main GitHub repo"
image: /assets/images/blog/repo-rename.png
---

> "There is nothing more permanent than a temporary solution".

You may ask, why our main repo is called so weird: `api-models`?
It is easy to explain `api` part but `models` is something strange and alien in this context.
If you see `api-models` in search results you will probably never expect it to be a collection of API **specs**.

But why we made this mistake when we created the repo?
At the beginning we were planning to build website with DB to store our collection and Repo was just a temporary solution.
So we basically used the first thing that came to our mind and didn't think it would have any long-term consequences.

But we feel it's time to rip off the bandaid:

![repo rename](/assets/images/blog/repo-rename.png)

<!--more-->

<br>
# API models VS API directory
What's the difference?
Let's try to google both terms and see the results:

![models vs directory](/assets/images/blog/repo-rename-google-models-vs-directory.png)

**"API directory"** appears to be much more relevant.

<br>
# Why "directory"?

The answer is simple. We've just used Google Trends to find what keywords are more popular:
![google trends](/assets/images/blog/repo-rename-google-trends.png)

<br>
# And what's about "openapi"?

Since we use "OpenAPI" as the primary format for our collection we want to be on the first page of GitHub search results by keyword "OpenAPI" (4th page at the moment).
As far as we know GitHub sorts search results by where the match occurs: in the project name, project description or inside `README.md`.
So placing right keywords in the right places is more important than number of stars, see screenshot:

![GitHub search](/assets/images/blog/github_search_openapi.png)

-----------------
What do you think about the new name? We'd like to hear your opinion in comments.
