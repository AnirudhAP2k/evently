import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only images are allowed" },
        { status: 400 }
      );
    }

    const MAX_SIZE = process.env.MAX_UPLOAD_SIZE ? Number.parseInt(process.env.MAX_UPLOAD_SIZE) : 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult : any = await new Promise((resolve, reject) => {      
      cloudinary.uploader.upload_stream(
        {
          folder: "uploads",
          resource_type: "image",
        },
        (error : any, result : any) => {
          if (error) reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json(
      {
        success: true,
        publicId: uploadResult.public_id || null,
        imageUrl: uploadResult.secure_url || null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
