import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import { stegaClean } from "next-sanity";
import { PAGE_QUERYResult } from "@/sanity.types";
import GridCard from "./grid-card";
import PricingCard from "./pricing-card";
import GridPost from "./grid-post";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type GridRow = Extract<Block, { _type: "grid-row" }>;
type GridColumn = NonNullable<NonNullable<GridRow["columns"]>[number]>;

const componentMap: {
  [K in GridColumn["_type"]]: React.ComponentType<
    Extract<GridColumn, { _type: K }>
  >;
} = {
  "grid-card": GridCard,
  "pricing-card": PricingCard,
  "grid-post": GridPost,
};

export default function GridRow({
  padding,
  colorVariant,
  gridColumns,
  columns,
}: GridRow) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      {columns && columns?.length > 0 && (
        <div
          className={cn(
            `grid grid-cols-1 gap-6`,
            `lg:${stegaClean(gridColumns)}`,
          )}
        >
          {columns.map((column) => {
            const Component = componentMap[column._type];
            if (!Component) {
              // Fallback for development/debugging of new component types
              console.warn(
                `No component implemented for grid column type: ${column._type}`,
              );
              return <div data-type={column._type} key={column._key} />;
            }
            return (
              <Component {...(column as any)} color={color} key={column._key} />
            );
          })}
        </div>
      )}
    </SectionContainer>
  );
}
