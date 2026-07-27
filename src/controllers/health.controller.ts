import { asyncHandler, ApiResponse } from "../utils/index.js";

export const healthCheck = asyncHandler(async (_req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                status: "UP",
                database: "CONNECTED",
                timestamp: new Date().toISOString(),
            },
            "Health check successful"
        )
    );
});