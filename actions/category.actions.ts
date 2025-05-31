'use server';

import { prisma } from "@/lib/db";
import { handleError, parseData } from "@/lib/utils";

interface CreateCategoryProps {
    categoryName: string
}

export const createCategory = async ({ categoryName }: CreateCategoryProps) => {
    try {
        const category = await prisma.category.create({
            data: { label: categoryName }
        });

        return parseData(category);
    } catch (error) {
        handleError(error);
    }
};

export const getAllCategories = async () => {
    try {
        const categories = await prisma.category.findMany();

        return parseData(categories);
    } catch (error) {
        handleError(error);
    }
};