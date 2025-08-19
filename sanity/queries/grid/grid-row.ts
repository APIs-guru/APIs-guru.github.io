import { groq } from "next-sanity";
import { gridCardQuery } from "@/sanity/queries/grid/grid-card";
import { pricingCardQuery } from "@/sanity/queries/grid/pricing-card";
import { gridPostQuery } from "@/sanity/queries/grid/grid-post";

// @sanity-typegen-ignore
export const gridRowQuery = groq`
  _type == "grid-row" => {
    _type,
    _key,
    padding,
    colorVariant,
    gridColumns,
    columns[]{
      ${gridCardQuery},
      ${pricingCardQuery},
      ${gridPostQuery},
    },
  }
`;
