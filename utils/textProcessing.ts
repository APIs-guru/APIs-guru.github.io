export const cleanDescription = (description: string): string => {
  if (!description) return "";

  return description
    .replace(/<[^>]*>/g, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/>\s*/g, "")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};
