import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificationToken";

export const GET = async (req: NextRequest) => {
    if (req.method !== "GET") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        const { searchParams } = req.nextUrl;
        const token = searchParams.get('token');
        
        if (!token) {
            return NextResponse.json({ error: "Verification token missing!" }, { status: 400 });
        }

        const existingToken = await getVerificationTokenByToken(token);

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

        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                emailVerified: new Date(),
                email: existingToken.email
            }
        });

        await prisma.verificationToken.delete({
            where: { id: existingToken.id },
        });

        return NextResponse.json({ message: "Email verified successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
