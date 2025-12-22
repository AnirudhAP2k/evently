import { prisma } from "@/lib/db";
import { GetAllEventsParams } from "@/lib/types";
import { parseData } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = req.nextUrl;

        const query = searchParams.get("query") || "";
        const category = searchParams.get("category") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "6");

        const conditions = {};

        const events = await prisma.events.findMany({
            ...conditions,
            include: {
                category: true,
                organizer: true,
            },
            orderBy: { createdAt: "desc" },
            skip: 0,
            take: limit,
        });
console.log(events);

        const eventsCount = await prisma.events.count(conditions);

        return NextResponse.json({
            data: parseData(events),
            totalPages: Math.ceil(eventsCount / limit),
        }, { status: 200 });
    } catch (error) {
        console.error("Event retrieval error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
