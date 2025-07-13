import React from "react";
import Image from "next/image";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
import { Button } from "./ui/button";

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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
            Wikipedia for Web APIs. Directory of REST API definitions.
          </h2>
        </div>
      </div>

      {/* Support content section */}
      <div className="text-center px-4 max-w-3xl mx-auto">
        <SocialLinks className="flex justify-center gap-4 mb-4" />
        {showSupport && (
          <>
            <p className="text-gray-800 mb-3">
              Help support the work that we do by contributing to our{" "}
              <Link
                href="https://opencollective.com/openapi-directory"
                className="text-blue-600 hover:underline"
              >
                Open Collective campaign
              </Link>
              !
            </p>
            <Button variant="cta" size="lg">
              <Link href="https://opencollective.com/openapi-directory">
                Support APIs.guru
              </Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
