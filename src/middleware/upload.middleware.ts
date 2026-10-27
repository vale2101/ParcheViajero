import multer from "multer";

const TIPOS = new Set(["image/jpeg", "image/png", "image/webp"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
  fileFilter: (_req, file, cb) =>
    TIPOS.has(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Solo se permiten JPG, PNG o WEBP")),
});