import type { ProjectStatus } from "@/content/i18n";

/** Accent color each project detail page's TechGrid takes on, tied to the
 * project's own status — same green/orange/blue association as the status
 * badges, just reused as the ambient background color instead of a label. */
export const PROJECT_STATUS_COLOR: Record<ProjectStatus, string> = {
  finished: "#00cc00",
  workingOn: "#F5A623",
  planned: "#3B82F6",
};
