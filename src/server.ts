import "dotenv/config";

import app from "./app.js";
import { connectDB, env } from "./config/index.js";

await connectDB();

app.listen(env.PORT, (error) => {
    if (error) throw error;
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
});