import React from "react";
import { ApiCardModel } from "../models/ApiCardModel";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import Image from "next/image";

export default function ApiCard({ model }: { model: ApiCardModel }) {
  // Generate slug using the same logic as the detail page
  const apiSlug = model.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <Link
      href={`/apis/${apiSlug}`}
      className="block hover:scale-105 transition-transform duration-200"
    >
      <Card className="flex flex-col text-center border border-[#388c9a] rounded-md bg-[#eee] overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow duration-200">
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

        <CardHeader className="text-[#388c9a] pb-2">
          <h2
            className="font-normal mb-0.5 whitespace-nowrap text-ellipsis overflow-hidden"
            title={model.info.title}
          >
            {model.info.title}
          </h2>
          <p className="text-sm text-gray-600">v{model.preferred}</p>
        </CardHeader>

        <CardContent className="p-[15px] bg-white flex-grow flex flex-col justify-between">
          <div>
            <Image
              src={model.logo.url || "/assets/images/no-logo.svg"}
              alt={`${model.info.title} API logo`}
              width={80}
              height={80}
              className="max-w-full max-h-[80px] p-[5px] mx-auto mb-4"
              style={{
                backgroundColor: model.logo.backgroundColor || "transparent",
              }}
            />
            <p className="leading-[1.2] overflow-hidden text-ellipsis h-[calc(1em*1.2*3)] text-sm text-gray-700">
              {model.cardDescription}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
