import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: NextRequest) {
  try {
    const clusters = await prisma.cluster.findMany({
      orderBy: { name: "asc" },
      include: {
        shops: {
          orderBy: { googleRating: "desc" },
        },
        _count: {
          select: { shops: true },
        },
      },
    });

    return NextResponse.json(clusters);
  } catch (error) {
    console.error("Error fetching clusters:", error);
    return NextResponse.json(
      { error: "Failed to fetch clusters" },
      { status: 500 }
    );
  }
}
