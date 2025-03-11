import { getVerificationTokenByEmail } from "@/data/verificationToken";
import { randomInt, randomUUID } from "crypto"
import { prisma } from "@/lib/db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenbyEmail } from "@/data/two-factor-token";

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

export const genTwoFactorToken = async (email: string) => {
    const token = randomInt(100*100, 1000*1000).toString();
    const expiresAt = new Date(new Date().getTime() + 900 * 1000);

    const existingToken = await getTwoFactorTokenbyEmail(email);

    if(existingToken) {
        await prisma.twoFactorToken.delete({
            where: { id: existingToken.id }
        });
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            email,
            token,
            expiresAt
        }
    });

    return twoFactorToken;
};