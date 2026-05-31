import { useEffect } from "react";

/**
 * Sets the browser document title for the current page.
 * Falls back to "MedClinic" when no title is provided.
 *
 * @param {string} title - Page-specific title (e.g. "Find a Doctor")
 *
 * @example
 * export default function DoctorsPage() {
 *   usePageTitle("Find a Doctor");
 *   ...
 * }
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — MedClinic` : "MedClinic";
    return () => {
      document.title = "MedClinic";
    };
  }, [title]);
}
