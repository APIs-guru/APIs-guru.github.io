import React from "react";
import ApiCard from "./ApiCard";
import { ApiCardModel } from "../models/ApiCardModel";

export default function Card({ model }: { model: ApiCardModel }) {
  return <ApiCard model={model} />;
}
