import { getVerificationTokenByEmail } from "@/data/verificationToken";
import { randomUUID } from "crypto"
import { prisma } from "@/lib/db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";

export const genVerificationToken = async (email: string) => {
    const token = randomUUID();
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) {
        await prisma.verificationToken.delete({
            where: { id: existingToken.id }
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expiresAt
        }
    });

    return verificationToken;
};

export const genPasswordResetToken = async (email: string) => {
    const token = randomUUID();
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if(existingToken) {
        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id }
        });
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expiresAt
        }
    });

    return passwordResetToken;
};