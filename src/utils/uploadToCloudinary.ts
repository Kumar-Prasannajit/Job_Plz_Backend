import { Readable } from "stream";

import cloudinary from "../config/cloudinary.js";

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
}

export const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string
): Promise<CloudinaryUploadResult> => {

    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "raw",
            },
            (error, result) => {

                if (error) {
                    reject(error);
                    return;
                }

                if (!result) {
                    reject(new Error("Cloudinary upload failed."));
                    return;
                }

                resolve({
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                });

            }
        );

        Readable.from(fileBuffer).pipe(uploadStream);

    });

};