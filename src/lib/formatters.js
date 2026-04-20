import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

export function formatDate(value, fallback = "No deadline") {
  if (!value) return fallback;
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? format(date, "MMM d, yyyy") : fallback;
}

export function timeAgo(value) {
  if (!value) return "Recently";
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? `${formatDistanceToNow(date)} ago` : "Recently";
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
