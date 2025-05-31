import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const file = body.file as File | undefined;

        if (!file || file === undefined) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const sanitizedFileName = file.name.replace(/\s+/g, "_");
        const filename = `${Date.now()}-${sanitizedFileName}`;
        const filePath = path.resolve(UPLOAD_DIR, filename);
        fs.writeFileSync(filePath, buffer);

        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            name: filename,
            imageUrl: fileUrl,
        }, { status: 200 });
    } catch (error: any) {
        console.error("File upload error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
