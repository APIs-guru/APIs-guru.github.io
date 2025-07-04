import React from "react";
import Image from "next/image";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
import { Button } from "./ui/button";

export default function Support({ showSupport = true }: { showSupport?: boolean }) {
  return (
    <section className="bg-white py-4 px-4 text-center">
      {/* Jumbotron-like container with background */}
      <div className="relative h-48 mb-6 flex items-center justify-center overflow-hidden">
        {/* Background image using Next Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/jumbo-background.svg"
            alt="Jumbotron background"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Content overlay with jumbotron styling */}
        <div className="relative z-10 text-center px-4 text-gray-600">
          <div className="mb-3">
            <Image
              src="/images/logo.svg"
              alt="APIs.guru logo"
              width={200}
              height={80}
              className="mx-auto"
            />
          </div>

          <h2 className="text-lg leading-tight">
            Wikipedia for Web APIs. Directory of REST API definitions.
          </h2>
        </div>
      </div>

      {/* Support content section */}
      <div className="text-center px-4 py-2 max-w-3xl mx-auto">
        <SocialLinks className="flex justify-center gap-4 mb-4" />

        {showSupport && (
          <>
            <p className="text-gray-700 mb-3">
              Help support the work that we do by contributing to our{" "}
              <Link
                href="https://opencollective.com/openapi-directory"
                className="text-blue-600 hover:underline"
              >
                Open Collective campaign
              </Link>
              !
            </p>
            <Button variant="cta" >
              <Link
                href="https://opencollective.com/openapi-directory"
                className=""
              >
                Support APIs.guru
              </Link>
            </Button>
            
          </>
        )}
      </div>
    </section>
  );
}
