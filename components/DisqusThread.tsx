"use client";
import React, { useEffect } from "react";

export default function DisqusThread({
  url,
  identifier,
}: {
  url: string;
  identifier: string;
}) {
  useEffect(() => {
    if (window && document) {
      const d = document;
      const s = d.createElement("script");
      s.src = "//apisguru.disqus.com/embed.js";
      s.setAttribute("data-timestamp", Date.now().toString());
      (d.head || d.body).appendChild(s);
    }
  }, [url, identifier]);

  return (
    <div id="disqus_thread" className="my-8">
      <noscript>
        <span className="text-red-600 font-semibold">
          Please enable JavaScript to view the{" "}
        </span>
        <a
          href="https://disqus.com/?ref_noscript"
          rel="nofollow"
          className="underline text-blue-700 hover:text-blue-900 transition-colors"
        >
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
}
