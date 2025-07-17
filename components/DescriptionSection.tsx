import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DescriptionSectionProps {
  description: string;
}

export default function DescriptionSection({
  description,
}: DescriptionSectionProps) {
  const isLongDescription =
    description.length > 300 ||
    (description.match(/<\/p>/g) || []).length > 1 ||
    (description.match(/<h[1-6]>/g) || []).length > 0;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Description</h2>
      {isLongDescription ? (
        <div className="relative">
          <input
            type="checkbox"
            id="expand-description"
            className="hidden peer"
          />
          {/* Content container with collapse effect */}
          <div className="overflow-hidden transition-all duration-300 ease-in-out peer-checked:max-h-[9999px] max-h-[12.5em]">
            <div className="prose prose-h1:font-bold prose-p:text-gray-700 prose-a:text-blue-600 !max-w-none">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>

          {/* Semi-transparent gradient overlay */}
          <div className="relative -mt-12 h-12 peer-checked:hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-gray-800/90 to-transparent pointer-events-none"></div>
          </div>

          {/* Show more button */}
          <div className="flex justify-center mt-4 peer-checked:hidden">
            <div className="flex items-center space-x-3">
              <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1 w-16"></div>
              <Button
                variant="outline"
                size="sm"
                className=" h-8 w-8  rounded-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                asChild
              >
                <label
                  htmlFor="expand-description"
                  className="cursor-pointer flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <ChevronDown className="h-4 w-4" />
                </label>
              </Button>
              <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1 w-16"></div>
            </div>
          </div>

          {/* Show less button */}
          <div className="flex justify-center mt-6 hidden peer-checked:block">
            <div className="flex items-center space-x-3">
              <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1 w-16"></div>
              <Button
                variant="outline"
                size="sm"
                className=" h-8 w-8 rounded-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                asChild
              >
                <label
                  htmlFor="expand-description"
                  className="cursor-pointer flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <ChevronUp className="h-4 w-4" />
                </label>
              </Button>
              <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1 w-16"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="prose prose-h1:font-bold prose-p:text-gray-700 prose-a:text-blue-600 prose-max-w-none">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}
    </div>
  );
}
