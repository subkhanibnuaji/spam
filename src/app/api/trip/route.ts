import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { optimizeRoute, generateTimeline } from "@/lib/trip-calculator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      startLat,
      startLng,
      startTime,
      transportMode,
      selectedClusterIds = [],
      selectedShopIds = [],
    } = body;

    // Validate required fields
    if (
      startLat === undefined ||
      startLng === undefined ||
      !startTime ||
      !transportMode
    ) {
      return NextResponse.json(
        { error: "Missing required fields: startLat, startLng, startTime, transportMode" },
        { status: 400 }
      );
    }

    if (selectedClusterIds.length === 0 && selectedShopIds.length === 0) {
      return NextResponse.json(
        { error: "At least one cluster or shop must be selected" },
        { status: 400 }
      );
    }

    // Fetch selected clusters with their shops
    const clusters = selectedClusterIds.length > 0
      ? await prisma.cluster.findMany({
          where: { id: { in: selectedClusterIds } },
          include: { shops: true },
        })
      : [];

    // Fetch individual selected shops
    const individualShops = selectedShopIds.length > 0
      ? await prisma.shop.findMany({
          where: { id: { in: selectedShopIds } },
        })
      : [];

    // Build trip stops array for the route optimizer
    const stops: {
      id: string;
      lat: number;
      lng: number;
      name: string;
      visitDuration: number;
      type: "shop" | "cluster";
    }[] = [];

    // For clusters: use cluster lat/lng, visitDuration = avgVisitMinutes * min(shopCount, 3)
    for (const cluster of clusters) {
      const shopCount = cluster.shops.length;
      const visitDuration = cluster.avgVisitMinutes * Math.min(shopCount, 3);
      stops.push({
        id: cluster.id,
        lat: cluster.latitude,
        lng: cluster.longitude,
        name: cluster.name,
        visitDuration,
        type: "cluster",
      });
    }

    // For individual shops: use shop lat/lng, visitDuration = 30
    for (const shop of individualShops) {
      if (shop.latitude === null || shop.longitude === null) {
        continue; // Skip shops without coordinates
      }
      stops.push({
        id: shop.id,
        lat: shop.latitude,
        lng: shop.longitude,
        name: shop.name,
        visitDuration: 30,
        type: "shop",
      });
    }

    if (stops.length === 0) {
      return NextResponse.json(
        { error: "No valid stops found (shops may be missing coordinates)" },
        { status: 400 }
      );
    }

    // Optimize route using nearest neighbor
    const optimizedStops = optimizeRoute(
      { lat: startLat, lng: startLng },
      stops
    );

    // Generate timeline with arrival/departure times and warnings
    const { timeline, totalDistance, totalDuration, estimatedEndTime } =
      generateTimeline(startLat, startLng, startTime, optimizedStops, transportMode);

    // Build lookup maps for clusters and shops
    const clusterMap = new Map<string, (typeof clusters)[0]>(
      clusters.map((c) => [c.id, c])
    );
    const shopMap = new Map<string, (typeof individualShops)[0]>(
      individualShops.map((s) => [s.id, s])
    );

    // Build the response stops
    const responseStops = timeline.map((entry, index) => {
      const item = entry.stop.type === "cluster"
        ? clusterMap.get(entry.stop.id)
        : shopMap.get(entry.stop.id);

      return {
        order: index + 1,
        type: entry.stop.type as "shop" | "cluster",
        item: item as unknown,
        arrivalTime: entry.arrivalTime,
        departureTime: entry.departureTime,
        visitDuration: entry.stop.visitDuration,
        distanceFromPrevious: entry.distanceFromPrevious,
        durationFromPrevious: entry.durationFromPrevious,
        warnings: entry.warnings,
      };
    });

    // Collect all warnings
    const allWarnings: string[] = [];
    for (const stop of responseStops) {
      allWarnings.push(...stop.warnings);
    }

    // Build selectedItems for storage
    const selectedItems = JSON.stringify({
      clusterIds: selectedClusterIds,
      shopIds: selectedShopIds,
    });

    // Build routeData for storage
    const routeData = JSON.stringify({
      totalDistance,
      totalDuration,
      estimatedEndTime,
      stops: responseStops,
    });

    // Save trip to database
    const trip = await prisma.tripPlan.create({
      data: {
        startAddress: `${startLat},${startLng}`,
        startLat,
        startLng,
        startTime,
        transportMode,
        selectedItems,
        routeData,
        totalDistance,
        totalDuration,
      },
    });

    const response = {
      tripId: trip.id,
      route: {
        totalDistance,
        totalDuration,
        estimatedEndTime,
        stops: responseStops,
      },
      warnings: allWarnings,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json(
      { error: "Failed to create trip plan" },
      { status: 500 }
    );
  }
}
