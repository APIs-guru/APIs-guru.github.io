---
layout: post
date: 2016-07-29
title: ReDoc - Reinventing OpenAPI-powered Documentation
image: /assets/images/blog/redoc-demo.png
---

SwaggerUI proves the possibility to use OpenAPI specs as a single source for generating API documentation. Although we love SwaggerUI we should admit an obvious fact: SwaggerUI is rather an API console than an API documentation.

# A long time ago in a galaxy far, far away....
[Rebilly](https://www.rebilly.com/) adopted Swagger as a definition language for their API, and they were looking for a documentation engine.
But they wanted to go beyond the industry standards and document their API to the fullest. Here’s how they did it:

- every field in JSON payloads;
- in their quest, they had to use almost every OpenAPI feature including lots of Mr. `discriminator` ;)
- resulting spec is really huge: 12K+ lines and growing! (one of the biggest we've seen in the wild). And believe us - they use all the possible tricks to reduce duplications.

So, they approached us with this challenging project: to build a brand new documentation engine - [ReDoc](https://github.com/Rebilly/ReDoc).

[![redoc](/assets/images/blog/redoc-demo.png)](https://rebilly.github.io/ReDoc/)

<!--more-->

#### [<center>Check out demo!</center>](https://rebilly.github.io/ReDoc/)

# The best part?
Together with Rebilly we realized the full potential of ReDoc since other API owners face exactly same problems. That's why we've decided to open-source it and stick with **vanilla** [OpenAPI](https://openapis.org/).
We'd love to thank Rebilly and personally [Adam Altman](https://www.linkedin.com/in/adamdaltman) for sponsoring this open-source project!
After months of work now we feel confident to make `1.0.0` release.

# Why should I use ReDoc?

Let’s take a look!

## Extremely easy deployment
No, it's really easy. Don't believe us? Take a look at the minimal setup:

<!-- RomanGotsiy/f5b0c999410199632cd5bdf4fe0aad5f -->

That's all folks! We've bundled everything (html, css, javascript) into a single file! Also, we're serving the latest release (and all previous releases) from our [CDN](https://github.com/Rebilly/ReDoc#releases).

## Why else?
- It's free and open-source project under [MIT license](https://github.com/Rebilly/ReDoc/blob/master/LICENSE)
- The widest OpenAPI features support (yes, it supports even `discriminator`)
- Neat documentation for nested objects
- Meaningful request/response samples generated using [openapi-sampler](https://github.com/APIs-guru/openapi-sampler)
- Code samples support (via [vendor extension](https://github.com/Rebilly/ReDoc/blob/master/docs/redoc-vendor-extensions.md#x-code-samples))
- Responsive three-panel design with menu/scrolling synchronization
- Integrate API introduction into side menu - ReDoc takes advantage of markdown headings from OpenAPI `description` field. It pulls them into side menu and also supports deep linking.

# Roadmap
Currently, we have the following global key points on our TO-DO list:

- Docs pre-rendering (performance and SEO)
- Built-in API Console
- Support for external styling

What's next? It depends on you! Don't hesitate to open issues and feature requests on [GitHub](https://github.com/Rebilly/ReDoc/issues). PRs are welcome too :)

Moreover, you can hire APIs.guru to do integration or customization of ReDoc for you needs.

# Stay tuned
At the beginning of the next week, we will release a support tool which will help you to easily setup OpenAPI spec repository with lots of appetizing features.

-----------------
If you need any help with integration ReDoc feel free to ask! Subscribe to our twitter so as not to miss ReDoc new releases and other news. Will you try ReDoc? Tell us in comments bellow :)

Star the project on GitHub <3:
<center><iframe src="https://ghbtns.com/github-btn.html?user=Rebilly&repo=ReDoc&type=star&count=true&size=large"
      frameborder="0" scrolling="0" width="130px" height="30px"></iframe></center>
