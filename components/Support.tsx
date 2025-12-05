import React from "react";
import Image from "next/image";
import Link from "next/link";
import SocialLinks from "./SocialLinks";

export default function Support({
  showSupport = true,
}: {
  showSupport?: boolean;
}) {
  return (
    <section className="bg-white   text-center  py-8">
      <div className="relative mb-2 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/jumbo-background.svg"
            alt=""
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="relative z-10 p-4  text-center">
          <div className="mb-3">
            <Image
              src="/images/logo.svg"
              alt="APIs.guru logo"
              width={200}
              height={80}
              className="mx-auto"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
            Wikipedia for Web APIs. Directory of REST API definitions.
          </h1>
        </div>
      </div>

      {/* Support content section */}
      <div className="text-center px-4 max-w-3xl mx-auto">
        <SocialLinks className="flex justify-center gap-4 mb-4" />
        {showSupport && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 inline-block">
            <p className="text-lg text-gray-800">
              Need help with APIs — hire true gurus:{" "}
              <a
                href="mailto:help@apis.guru"
                className="font-bold text-blue-600 hover:underline"
              >
                help@apis.guru
              </a>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
