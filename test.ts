import {
  normalizeDate,
  normalizeYearMonth,
  normalizeYear,
} from "./src/modules/resumes/normalizers/utils/date.utils.js";

const values = [
  "Sep 2025",
  "Mar 2025",
  "January 2024",
  "2025",
  "2025-09",
];

for (const value of values) {
  console.log("----------------");
  console.log("Input:", value);
  console.log("normalizeYearMonth:", normalizeYearMonth(value));
  console.log("normalizeYear:", normalizeYear(value));
  console.log("normalizeDate:", normalizeDate(value));
}