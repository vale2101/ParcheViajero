import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export interface ImagenSubida {
  url: string;
  public_id: string;
}

export function subirImagen(buffer: Buffer, carpeta: string): Promise<ImagenSubida> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `parche-viajero/${carpeta}`,
          resource_type: "image",
          transformation: [
            { width: 1280, height: 1280, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (err, result) =>
          err || !result
            ? reject(err ?? new Error("Cloudinary no devolvió resultado"))
            : resolve({ url: result.secure_url, public_id: result.public_id }),
      )
      .end(buffer);
  });
}

export async function borrarImagen(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("No se pudo borrar de Cloudinary:", publicId, error);
  }
}