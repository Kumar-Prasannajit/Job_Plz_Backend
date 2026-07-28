import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter: multer.Options["fileFilter"] = (
    _req,
    file,
    cb
) => {

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
        return;
    }

    cb(new Error("Only PDF, DOC and DOCX files are allowed."));
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter,
});