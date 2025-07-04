import React from "react";
import { ApiCardModel } from "../models/ApiCardModel";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import Image from "next/image";

// Define an interface for the version object
interface ApiVersion {
  version: string;
  swaggerUrl: string;
  swaggerYamlUrl: string;
}

export default function ApiCard({ model }: { model: ApiCardModel }) {
  return (
    <Card className="flex flex-col text-center border border-[#388c9a] rounded-md bg-[#eee] overflow-hidden ">
      {model.classes ? (
        <span
          className={`block w-[125px] py-1 px-5 relative text-center text-black top-[15px] -left-[28px] rotate-[-45deg] opacity-75 ${
            model.classes.includes("flash-green")
              ? "bg-[#2c7]"
              : model.classes.includes("flash-yellow")
              ? "bg-[#fed16e]"
              : model.classes.includes("flash-red")
              ? "bg-red-500"
              : ""
          }`}
          title={model.flashTitle}
        >
          <strong>{model.flashText}</strong>
        </span>
      ) : (
        <span className=""></span>
      )}

      <CardHeader className=" text-[#388c9a]">
        <h2 className="font-normal mb-0.5 whitespace-nowrap text-ellipsis overflow-hidden" title={model.info.title}>
          {model.externalUrl ? (
            <Link href={model.externalUrl} target="_blank" className="text-[#388c9a] underline hover:no-underline">
              {model.info.title}
            </Link>
          ) : (
            model.info.title
          )}
        </h2>
      </CardHeader>

      <CardContent className="p-[15px] bg-white h-[calc(1em*1.2*3+150px)]">
        <Image
          src={model.logo.url || "/assets/images/no-logo.svg"}
          alt={`${model.info.title} API logo`}
          width={100}
          height={100}
          className="max-w-full max-h-[100px] p-[10px] mx-auto"
          style={{ backgroundColor: model.logo.backgroundColor || "transparent" }}
        />
        <p className="leading-[1.2] overflow-hidden text-ellipsis h-[calc(1em*1.2*3)] mt-[15px]">
          {model.cardDescription}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col">
        <h3 className="font-normal mb-0.5">OpenAPI:</h3>
        <h4 className="font-normal mb-0.5">Preferred Version - {model.preferred}</h4>

        <ul className="flex flex-row list-none justify-evenly ml-0 gap-2">
          <li>
            <Link href={model.api.swaggerUrl} target="_blank" className="py-[0.1em] px-[0.5em] bg-[#388c9a] rounded-[2px] text-white">
              JSON
            </Link>
          </li>
          <li>
            <Link href={model.api.swaggerYamlUrl} target="_blank" className="py-[0.1em] px-[0.5em] bg-[#388c9a] rounded-[2px] text-white">
              YAML
            </Link>
          </li>
          <li>
            <Link href={model.origUrl} target="_blank" className="py-[0.1em] px-[0.5em] bg-[#388c9a] rounded-[2px] text-white">
              Orig
            </Link>
          </li>
          <li>
            <Link
              href={`https://redocly.github.io/redoc/?url=${model.api.swaggerUrl}`}
              target="_blank"
              className="py-[0.1em] px-[0.5em] bg-[#388c9a] rounded-[2px] text-white"
            >
              Docs
            </Link>
          </li>
        </ul>

        {model.versions && (
          <details className="w-full">
            <summary className="cursor-pointer">
              <h4 className="font-normal mb-0.5 inline">All Versions</h4>
            </summary>
            <ul className="flex flex-col-reverse list-none ml-0">
              {model.versions.map((version: ApiVersion, index: number) => (
                <li key={index} className="flex justify-center m-[0_2px]">
                  <span>{version.version}</span>
                  <ul className="flex flex-row list-none justify-evenly ml-0">
                    <li>
                      <Link href={version.swaggerUrl} target="_blank" className="py-[0.1em] px-[0.5em] bg-[#388c9a] rounded-[2px] text-white">
                        JSON
                      </Link>
                    </li>
                    <li>
                      <Link href={version.swaggerYamlUrl} target="_blank" className="py-[0.1em] px-[0.5em] bg-[#388c9a] rounded-[2px] text-white">
                        YAML
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`https://redocly.github.io/redoc/?url=${version.swaggerUrl}`}
                        target="_blank"
                        className="py-[0.1em] px-[0.5em] bg-[#388c9a] rounded-[2px] text-white"
                      >
                        Docs
                      </Link>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </details>
        )}

        <details className="w-full">
          <summary className="cursor-pointer">
            <h4 className="font-normal mb-0.5 inline">Tools</h4>
          </summary>
          <ul className="flex flex-row list-none justify-evenly ml-0">
            {model.integrations.map((integration, index) => (
              <li key={index} className="text-[0.8em]">
                <Link href={integration.template} target="_blank" className="py-[0.1em] px-[0.5em] bg-[#388c9a] rounded-[2px] text-white">
                  {integration.text}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </CardFooter>
    </Card>
  );
}
