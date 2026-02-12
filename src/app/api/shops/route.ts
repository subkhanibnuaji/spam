import { NextRequest, NextResponse } from "next/server";
import { queryShops } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const tier = searchParams.get("tier") || undefined;
    const district = searchParams.get("district") || undefined;
    const clusterId = searchParams.get("clusterId") || undefined;
    const hasHomeService = searchParams.get("hasHomeService") === "true" ? true : undefined;
    const surfaceConfirmed = searchParams.get("surfaceConfirmed") === "true" ? true : undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "googleRating";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = queryShops({
      tier,
      district,
      clusterId,
      hasHomeService,
      surfaceConfirmed,
      search,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { error: "Failed to fetch shops" },
      { status: 500 }
    );
  }
}
