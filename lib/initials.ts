export function getInitials(name: string | null | undefined): string {
  if (!name || !name.trim()) return "NA";

  return name
    .split(" ")
    .filter(Boolean) // remove extra spaces
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
