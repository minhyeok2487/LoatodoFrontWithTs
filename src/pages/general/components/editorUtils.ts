const HTML_TAG_REGEX = /<\/?[a-z][\s\S]*>/i;

export const normaliseToHtml = (raw: string): string => {
  if (!raw) {
    return "";
  }

  if (HTML_TAG_REGEX.test(raw.trim())) {
    return raw;
  }

  return raw
    .split(/\n{2,}/)
    .map((paragraph) => {
      const trimmed = paragraph.trim();

      if (!trimmed) {
        return "<p><br /></p>";
      }

      return `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
};

export const hasVisibleContent = (raw: string): boolean => {
  if (!raw) {
    return false;
  }

  if (!HTML_TAG_REGEX.test(raw.trim())) {
    return raw.trim().length > 0;
  }

  const stripped = raw
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return stripped.length > 0;
};

const escapeHtml = (input: string) =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export default normaliseToHtml;
