import { NextRequest, NextResponse } from "next/server";
import { getClustersWithShops } from "@/lib/data";

export async function GET(_request: NextRequest) {
  try {
    const clusters = getClustersWithShops();
    return NextResponse.json(clusters);
  } catch (error) {
    console.error("Error fetching clusters:", error);
    return NextResponse.json(
      { error: "Failed to fetch clusters" },
      { status: 500 }
    );
  }
}
