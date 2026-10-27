import clsx from "clsx";
import { PROGRESS_STAGES } from "../constants/statuses";

export function cn(...classes) {
  return clsx(classes);
}

// Postgres error code for a unique constraint violation (e.g. a duplicate save or import).
export function isUniqueViolation(error) {
  return error?.code === "23505";
}

export function stagePercent(stage) {
  const index = PROGRESS_STAGES.indexOf(stage);
  if (index < 0) return 0;
  return Math.round(((index + 1) / PROGRESS_STAGES.length) * 100);
}

export function groupCount(items, keyOrGetter) {
  return items.reduce((acc, item) => {
    const key = typeof keyOrGetter === "function" ? keyOrGetter(item) : item[keyOrGetter];
    acc[key || "Unknown"] = (acc[key || "Unknown"] || 0) + 1;
    return acc;
  }, {});
}

export function chartDataFromCounts(counts) {
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "OS";
}
