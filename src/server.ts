import app from "./app.js";
import { connectDB, env } from "./config/index.js";

await connectDB();

app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
});