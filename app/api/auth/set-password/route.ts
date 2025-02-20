import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/data/user";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { SetNewPasswordSchema } from "@/lib/validation";

export const POST = async (req: NextRequest) => {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    try { 
        const token = req.nextUrl.searchParams.get('token');

        const data = await req.json();

        const validated = SetNewPasswordSchema.safeParse(data);

        if (!validated.success) {
            return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
        }

        if (!token) {
            return NextResponse.json({ error: "Token missing!" }, { status: 400 });
        }

        const existingToken = await getPasswordResetTokenByToken(token);

        if (!existingToken) {
            return NextResponse.json({ error: "Token does not exists" }, { status: 400 });
        }

        const hasExpired = new Date(existingToken.expiresAt) < new Date();
        
        if(hasExpired) {
            return NextResponse.json({ error: "Token has expired!" }, { status: 400 });
        }
        
        const existingUser = await getUserByEmail(existingToken.email);

        if(!existingUser) {
            return NextResponse.json({ error: "Email does not exists" }, { status: 404 });
        }

        const { password } = validated.data;

        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(password, salt);

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword },
        });

        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id },
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
