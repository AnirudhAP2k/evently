"use server";

import { prisma } from "@/lib/db";

export const getTwoFactorConfirmationbyUserId= async (userId: string) => {
    try {
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
            where: { userId },
        });

        return twoFactorConfirmation;
    } catch (error) {
        console.error(error);
        return null;
    }
};