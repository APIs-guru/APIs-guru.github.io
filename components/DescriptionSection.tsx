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
        <>
          <input
            type="checkbox"
            id="expand-description"
            className="hidden peer"
          />
          <div className="prose prose-neutral dark:prose-invert max-w-none hidden peer-checked:block">
            <div dangerouslySetInnerHTML={{ __html: description }} />
            <label
              htmlFor="expand-description"
              className="text-[#388c9a] hover:underline mt-2 inline-block cursor-pointer"
            >
              Show less
            </label>
          </div>
          <div className="relative prose prose-neutral dark:prose-invert max-w-none block peer-checked:hidden">
            <div
              className="line-clamp-3"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <label
              htmlFor="expand-description"
              className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 px-1 text-[#388c9a] hover:underline cursor-pointer"
            >
              ...more
            </label>
          </div>
        </>
      ) : (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}
    </div>
  );
}
