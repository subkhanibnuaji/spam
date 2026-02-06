import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const tier = searchParams.get("tier");
    const district = searchParams.get("district");
    const clusterId = searchParams.get("clusterId");
    const hasHomeService = searchParams.get("hasHomeService");
    const surfaceConfirmed = searchParams.get("surfaceConfirmed");
    const search = searchParams.get("search");
    const allowedSortFields = ["googleRating", "googleReviews", "name", "tier", "lcdPriceMin"];
    const rawSortBy = searchParams.get("sortBy") || "googleRating";
    const sortBy = allowedSortFields.includes(rawSortBy) ? rawSortBy : "googleRating";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Build Prisma where clause
    const where: Record<string, unknown> = {};

    if (tier) {
      where.tier = tier;
    }

    if (district) {
      where.district = district;
    }

    if (clusterId) {
      where.clusterId = clusterId;
    }

    if (hasHomeService !== null && hasHomeService !== undefined && hasHomeService !== "") {
      where.hasHomeService = hasHomeService === "true";
    }

    if (surfaceConfirmed !== null && surfaceConfirmed !== undefined && surfaceConfirmed !== "") {
      where.surfaceConfirmed = surfaceConfirmed === "true";
    }

    // SQLite: contains is case-insensitive by default, no need for mode: 'insensitive'
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

    // Run data query and count queries in parallel
    const [data, total, tierCountsRaw] = await Promise.all([
      prisma.shop.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.shop.count({ where }),
      prisma.shop.groupBy({
        by: ["tier"],
        _count: { tier: true },
      }),
    ]);

    // Build tier counts map for tiers 1-8
    const tierCounts: Record<string, number> = {};
    for (const entry of tierCountsRaw) {
      tierCounts[entry.tier] = entry._count.tier;
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data,
      pagination: { total, page, limit, totalPages },
      meta: { tierCounts },
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { error: "Failed to fetch shops" },
      { status: 500 }
    );
  }
}
