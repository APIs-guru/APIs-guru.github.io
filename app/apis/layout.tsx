"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { SlashIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type BreadcrumbItemType =
  | { name: string; href: string; isEllipsis?: never }
  | { name: string; isEllipsis: boolean; href?: never };

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItemType[] => {
    const paths = pathname.split("/").filter((path) => path);
    const items: BreadcrumbItemType[] = [
      { name: "Home", href: "/" },
      ...paths
        .map((path, index): BreadcrumbItemType | null => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;

          if (path.toLowerCase() === "apis") {
            return null;
          }
          return {
            name:
              path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
            href,
          };
        })
        .filter((item): item is BreadcrumbItemType => item !== null),
    ];

    if (items.length > 4) {
      return [
        items[0],
        { name: "More", isEllipsis: true },
        items[items.length - 2],
        items[items.length - 1],
      ];
    }

    return items;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <div className="min-h-screen container mx-auto">
      <div className="p-4 bg-background max-w-7xl mx-auto">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center gap-2 text-sm sm:text-base">
            {breadcrumbItems.map((item, index) => (
              <div key={item.href || item.name} className="flex items-center">
                {index > 0 && (
                  <BreadcrumbSeparator className="mx-1">
                    <SlashIcon className="h-4 w-4 text-muted-foreground" />
                  </BreadcrumbSeparator>
                )}
                {"isEllipsis" in item && item.isEllipsis ? (
                  <BreadcrumbItem>
                    <Drawer>
                      <DrawerTrigger className="text-muted-foreground hover:text-foreground transition-colors">
                        <BreadcrumbEllipsis className="h-4 w-4" />
                      </DrawerTrigger>
                      <DrawerContent className="bg-background">
                        <div className="p-4">
                          {generateBreadcrumbs().map((subItem) => (
                            <Link
                              key={subItem.href || subItem.name}
                              href={subItem.href || "#"}
                              className="block py-2 text-sm hover:text-primary transition-colors truncate"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    {index === breadcrumbItems.length - 1 ? (
                      <BreadcrumbPage className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[300px]">
                        {item.name}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href || "#"}
                          className="text-muted-foreground hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-[300px]"
                        >
                          {item.name}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
