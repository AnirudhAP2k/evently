"use server";

import { prisma } from "@/lib/db";

export const getVerificationTokenByEmail = async (
    email: string
) => {
    try {
        const verificatonToken = await prisma.verificationToken.findFirst({
            where: { email }
        });

        return verificatonToken;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getVerificationTokenByToken = async (
    token: string
) => {
    try {
        const verificatonToken = await prisma.verificationToken.findUnique({
            where: { token }
        });

        return verificatonToken;
    } catch (error) {
        console.error(error);
        return null;
    }
}