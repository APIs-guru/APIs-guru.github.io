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
            <div className="prose prose-h1:font-bold prose-p:text-gray-700 prose-a:text-blue-600 prose-max-w-none">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>
          
          {/* Semi-transparent gradient overlay - positioned after content */}
          <div className="relative -mt-12 h-12 peer-checked:hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-gray-800/80 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Show more button */}
          <div className="text-center mt-2 peer-checked:hidden">
            <label
              htmlFor="expand-description"
              className="text-[#388c9a] hover:underline cursor-pointer block w-full"
            >
              Show more
            </label>
          </div>
          
          {/* Show less button */}
          <div className="text-center mt-2 hidden peer-checked:block">
            <label
              htmlFor="expand-description"
              className="text-[#388c9a] hover:underline cursor-pointer block w-full"
            >
              Show less
            </label>
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