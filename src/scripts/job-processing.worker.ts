import "../workers/job-processing.worker.js";

console.log("");
console.log("========================================");
console.log("🚀 Job Processing Worker Running");
console.log("========================================");

// Keep the process alive
await new Promise(() => {});