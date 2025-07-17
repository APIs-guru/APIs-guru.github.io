import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About APIs.guru",
  description: "Learn more about the APIs.guru project and its contributors",
};

// SVG Components can be imported from separate files in a real implementation
const NumberRomb = () => (
  <svg viewBox="0 0 100 100" className="number-romb-svg">
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      transform="rotate(45 50 50)"
      strokeWidth="4"
      stroke="#F5C01B"
      fill="none"
    />
  </svg>
);

// Fetch metrics on the server
async function getMetrics() {
  try {
    const response = await fetch("https://api.apis.guru/v2/metrics.json", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("Failed to fetch metrics");
    return response.json();
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return { numAPIs: 2232, numEndpoints: 75747 }; // Fallback values
  }
}

export default async function AboutPage() {
  // Fetch metrics on the server
  const metrics = await getMetrics();

  return (
    <div className="container mx-auto">
      <div className="wrapper home max-w-4xl mx-auto px-4">
        <section className="mb-16">
          <div className="motto text-2xl text-center mb-8">
            Our goal is to create a machine-readable Wikipedia for Web APIs in
            the{" "}
            <a
              href="https://spec.openapis.org/oas/latest.html"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              OpenAPI Specification
            </a>{" "}
            format, with the following principals:
          </div>
          <div className="principles relative border-l-4 border-gray-500 pl-8 py-4 ml-8">
            <div className="principle text-xl mb-4">
              {" "}
              Open source, community driven project{" "}
            </div>
            <div className="principle text-xl mb-4">
              {" "}
              Only publicly available APIs (free or paid){" "}
            </div>
            <div className="principle text-xl mb-4">
              {" "}
              Anyone can add or change an API, not only API owners{" "}
            </div>
            <div className="principle text-xl">
              {" "}
              All data can be accessed through an HTTP API{" "}
            </div>
          </div>
        </section>

        <section className="numbers flex justify-around mb-16 text-center">
          <div className="number flex flex-col items-center">
            <div className="relative mb-2">
              <NumberRomb />
              <div className="number-value absolute inset-0 flex items-center justify-center text-3xl font-bold">
                {metrics.numAPIs.toLocaleString()}
              </div>
            </div>
            <div className="description text-lg">API descriptions</div>
          </div>

          <div className="number flex flex-col items-center">
            <div className="relative mb-2">
              <NumberRomb />
              <div className="number-value absolute inset-0 flex items-center justify-center text-3xl font-bold">
                {metrics.numEndpoints.toLocaleString()}
              </div>
            </div>
            <div className="description text-lg">Endpoints</div>
          </div>

          <div className="number flex flex-col items-center">
            <div className="relative mb-2">
              <NumberRomb />
              <div className="number-value absolute inset-0 flex items-center justify-center text-3xl font-bold">
                2,407
              </div>
            </div>
            <div className="description text-lg">Stars on GitHub</div>
          </div>
        </section>

        <section className="activities mb-16 text-center">
          <header className="text-center text-3xl font-bold mb-8">
            What does APIs.guru do?
          </header>
          <div className="text-center mb-8">
            <Image
              src="/images/svg/light-bulb.svg"
              width={128}
              height={128}
              alt="Light bulb"
              className="mx-auto"
            />
          </div>

          {/* Main connecting line from lightbulb */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 transform -translate-x-px"></div>

            <div className="activities-row flex flex-col lg:flex-row relative">
              <div className="activities-column w-full lg:w-1/2 lg:pr-8">
                <div className="activity flex items-center mb-12 text-right">
                  <div className="flex-1 pr-4">
                    <div className="text-lg text-gray-700">
                      Search for public API definitions
                    </div>
                  </div>
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <Image
                      src="/images/svg/search.svg"
                      width={54}
                      height={54}
                      alt="Search"
                      className="relative z-10"
                    />
                  </div>
                </div>

                <div className="activity flex items-center mb-12 text-right">
                  <div className="flex-1 pr-4">
                    <div className="text-lg text-gray-700">
                      Filter out private and non-reliable APIs
                    </div>
                  </div>
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <Image
                      src="/images/svg/filter.svg"
                      width={54}
                      height={54}
                      alt="Filter"
                      className="relative z-10"
                    />
                  </div>
                </div>

                <div className="activity flex items-center mb-12 text-right">
                  <div className="flex-1 pr-4">
                    <div className="text-lg text-gray-700">
                      Update definitions on a weekly basis
                    </div>
                  </div>
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <Image
                      src="/images/svg/update.svg"
                      width={54}
                      height={54}
                      alt="Update"
                      className="relative z-10"
                    />
                  </div>
                </div>
              </div>

              <div className="activities-column w-full lg:w-1/2 lg:pl-8">
                <div className="activity flex items-center mb-12 text-left">
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <Image
                      src="/images/svg/convert.svg"
                      width={54}
                      height={54}
                      alt="Convert"
                      className="relative z-10"
                    />
                  </div>
                  <div className="flex-1 pl-4">
                    <div className="text-lg text-gray-700">
                      Convert different formats into OpenAPI 3.0
                    </div>
                  </div>
                </div>

                <div className="activity flex items-center mb-12 text-left">
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <Image
                      src="/images/svg/fix.svg"
                      width={54}
                      height={54}
                      alt="Fix"
                      className="relative z-10"
                    />
                  </div>
                  <div className="flex-1 pl-4">
                    <div className="text-lg text-gray-700">
                      Correct mistakes, ~80% of definitions have some
                    </div>
                  </div>
                </div>

                <div className="activity flex items-center mb-12 text-left">
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <Image
                      src="/images/svg/add.svg"
                      width={54}
                      height={54}
                      alt="Add"
                      className="relative z-10"
                    />
                  </div>
                  <div className="flex-1 pl-4">
                    <div className="text-lg text-gray-700">
                      Add additional data, like: logo, categories
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contribution-process mb-16 text-center">
          <header className="text-center text-3xl font-bold mb-8">
            Contribution process
          </header>
          <div className="text-center mt-8">
            <Image
              src="/images/svg/contribution-graph.svg"
              width={700}
              height={300}
              alt="Contribution process"
              className="mx-auto w-3/4 md:w-auto"
            />
          </div>
        </section>

        <section className=" text-center mb-16">
          <Link href="/browse-apis/">
            <Button variant={"cta"} className="text-lg font-semibold">
              Browse APIs
            </Button>
          </Link>
        </section>

        <section className="join-movement mb-16">
          <header className="text-center text-3xl font-bold mb-8">
            Join the movement
          </header>
        </section>
      </div>
    </div>
  );
}
