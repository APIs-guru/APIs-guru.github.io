export const cleanDescription = (description: string): string => {
  if (!description) return "";

  return description
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/>\s/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
