"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Navigation,
  MapPin,
  Clock,
  Route,
  ChevronDown,
  ChevronUp,
  Phone,
  Shield,
  Star,
  Copy,
  Share2,
  Car,
  Bike,
  Bus,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Home,
  ArrowDown,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { TierBadge } from "@/components/shops/tier-badge";
import { Loading } from "@/components/shared/loading";
import { DEFAULT_START, TIER_CONFIG, TierKey } from "@/lib/constants";
import {
  formatCurrency,
  formatWhatsAppLink,
  formatGoogleMapsLink,
} from "@/lib/utils";
import type { Cluster, Shop, TripResponse } from "@/types";

const TripMap = dynamic(() => import("@/components/trip/trip-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <Loading size="lg" />
    </div>
  ),
});

interface ClusterWithShops extends Cluster {
  shops: Shop[];
  _count?: { shops: number };
}

export default function TripPlannerPage() {
  const [clusters, setClusters] = useState<ClusterWithShops[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [trip, setTrip] = useState<TripResponse | null>(null);

  // Settings
  const [startAddress, setStartAddress] = useState(DEFAULT_START.address);
  const [startLat, setStartLat] = useState(DEFAULT_START.lat);
  const [startLng, setStartLng] = useState(DEFAULT_START.lng);
  const [startTime, setStartTime] = useState("08:30");
  const [transportMode, setTransportMode] = useState<
    "motorcycle" | "car" | "public"
  >("motorcycle");

  // Selection
  const [selectedClusterIds, setSelectedClusterIds] = useState<Set<string>>(
    new Set()
  );
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchClusters();
  }, []);

  async function fetchClusters() {
    try {
      const res = await fetch("/api/clusters");
      const data = await res.json();
      setClusters(data);
    } catch (error) {
      console.error("Failed to fetch clusters:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleCluster = (id: string) => {
    setSelectedClusterIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedClusters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedShopCount = useMemo(() => {
    return clusters
      .filter((c) => selectedClusterIds.has(c.id))
      .reduce((acc, c) => acc + (c.shops?.length || c._count?.shops || 0), 0);
  }, [clusters, selectedClusterIds]);

  async function generateTrip() {
    if (selectedClusterIds.size === 0) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startLat,
          startLng,
          startTime,
          transportMode,
          selectedClusterIds: Array.from(selectedClusterIds),
        }),
      });
      const data = await res.json();
      setTrip(data);
    } catch (error) {
      console.error("Failed to generate trip:", error);
    } finally {
      setGenerating(false);
    }
  }

  function copyTripSummary() {
    if (!trip) return;
    const lines = [
      `Surface Repair Trip Plan`,
      `Date: ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
      `Start: ${startAddress} at ${startTime}`,
      `Transport: ${transportMode}`,
      ``,
      `Route (${trip.route.stops.length} stops):`,
      ...trip.route.stops.map(
        (stop, i) =>
          `${i + 1}. ${stop.arrivalTime} - ${stop.type === "cluster" ? (stop.item as Cluster).name : (stop.item as Shop).name}${stop.warnings.length > 0 ? " ⚠️" : ""}`
      ),
      ``,
      `Total Distance: ${trip.route.totalDistance} km`,
      `Total Duration: ${Math.round(trip.route.totalDuration / 60)}h ${trip.route.totalDuration % 60}m`,
      `Estimated End: ${trip.route.estimatedEndTime}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
  }

  function shareViaWhatsApp() {
    if (!trip) return;
    const lines = [
      `*Surface Repair Trip Plan* 🔧`,
      `📅 ${new Date().toLocaleDateString("id-ID")}`,
      `📍 Start: ${startAddress}`,
      `🕐 Departure: ${startTime}`,
      ``,
      ...trip.route.stops.map(
        (stop, i) =>
          `${i + 1}. ${stop.arrivalTime} - *${stop.type === "cluster" ? (stop.item as Cluster).name : (stop.item as Shop).name}*`
      ),
      ``,
      `📏 Total: ${trip.route.totalDistance}km | ⏱️ ${Math.round(trip.route.totalDuration / 60)}h${trip.route.totalDuration % 60}m`,
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  // Map markers
  const mapMarkers = useMemo(() => {
    if (trip) {
      return trip.route.stops.map((stop, i) => ({
        lat:
          stop.type === "cluster"
            ? (stop.item as Cluster).latitude
            : (stop.item as Shop).latitude || 0,
        lng:
          stop.type === "cluster"
            ? (stop.item as Cluster).longitude
            : (stop.item as Shop).longitude || 0,
        label: `${i + 1}`,
        name:
          stop.type === "cluster"
            ? (stop.item as Cluster).name
            : (stop.item as Shop).name,
        tier: stop.type === "shop" ? (stop.item as Shop).tier : undefined,
      }));
    }
    return clusters.map((c) => ({
      lat: c.latitude,
      lng: c.longitude,
      label: String(c.shops?.length || c._count?.shops || 0),
      name: c.name,
      selected: selectedClusterIds.has(c.id),
    }));
  }, [trip, clusters, selectedClusterIds]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Navigation className="h-6 w-6" />
            Trip Planner
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plan efficient multi-shop visits across Jakarta
          </p>
        </div>
        {!trip && (
          <Button
            onClick={generateTrip}
            disabled={selectedClusterIds.size === 0 || generating}
            size="lg"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Route className="h-4 w-4 mr-2" />
            )}
            Generate Route
          </Button>
        )}
      </div>

      {/* Map */}
      <div className="mb-6 rounded-lg overflow-hidden border">
        <TripMap
          markers={mapMarkers}
          startLat={startLat}
          startLng={startLng}
          showRoute={!!trip}
        />
      </div>

      {trip ? (
        /* Trip Results */
        <div className="space-y-6">
          {/* Trip Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Trip Summary</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyTripSummary}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareViaWhatsApp}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTrip(null)}
                  >
                    Edit Plan
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Stops</p>
                  <p className="text-xl font-bold">
                    {trip.route.stops.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="text-xl font-bold">
                    {trip.route.totalDistance} km
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-xl font-bold">
                    {Math.floor(trip.route.totalDuration / 60)}h{" "}
                    {trip.route.totalDuration % 60}m
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Est. End</p>
                  <p className="text-xl font-bold">
                    {trip.route.estimatedEndTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {trip.warnings.length > 0 && (
            <Card className="border-yellow-300 bg-yellow-50">
              <CardContent className="pt-4">
                {trip.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-800">{w}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <div className="space-y-0">
            {/* Start */}
            <div className="flex items-start gap-4 pb-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Home className="h-5 w-5" />
                </div>
                <div className="w-0.5 h-8 bg-gray-300 mt-2" />
              </div>
              <div>
                <p className="font-medium">{startTime} START</p>
                <p className="text-sm text-muted-foreground">{startAddress}</p>
              </div>
            </div>

            {trip.route.stops.map((stop, i) => {
              const isCluster = stop.type === "cluster";
              const item = stop.item;
              const name = isCluster
                ? (item as Cluster).name
                : (item as Shop).name;
              const isLast = i === trip.route.stops.length - 1;

              return (
                <div key={i}>
                  {/* Travel segment */}
                  <div className="flex items-start gap-4 pb-2 pl-5">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowDown className="h-3 w-3" />
                      {stop.durationFromPrevious} min ({stop.distanceFromPrevious} km)
                    </div>
                  </div>

                  {/* Stop */}
                  <div className="flex items-start gap-4 pb-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-bold ${
                          isCluster
                            ? "bg-blue-500"
                            : TIER_CONFIG[
                                (item as Shop).tier as TierKey
                              ]?.bg || "bg-gray-500"
                        }`}
                      >
                        {stop.order}
                      </div>
                      {!isLast && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{stop.arrivalTime}</p>
                        <span className="font-medium">{name}</span>
                        {!isCluster && (
                          <TierBadge
                            tier={(item as Shop).tier}
                            size="sm"
                          />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isCluster
                          ? (item as Cluster).address
                          : (item as Shop).address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Est. visit: {stop.visitDuration} min • Depart:{" "}
                        {stop.departureTime}
                      </p>

                      {stop.warnings.map((w, wi) => (
                        <div
                          key={wi}
                          className="flex items-center gap-1 text-xs text-yellow-600 mt-1"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {w}
                        </div>
                      ))}

                      {/* Quick actions */}
                      <div className="flex gap-2 mt-2">
                        {!isCluster && (item as Shop).whatsapp && (
                          <a
                            href={formatWhatsAppLink(
                              (item as Shop).whatsapp!
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              WA
                            </Button>
                          </a>
                        )}
                        <a
                          href={formatGoogleMapsLink(
                            isCluster
                              ? (item as Cluster).latitude
                              : (item as Shop).latitude || 0,
                            isCluster
                              ? (item as Cluster).longitude
                              : (item as Shop).longitude || 0
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            Maps
                          </Button>
                        </a>
                      </div>

                      {/* Cluster shops list */}
                      {isCluster && (item as ClusterWithShops).shops && (
                        <div className="mt-2 space-y-1">
                          {((item as ClusterWithShops).shops || []).map(
                            (shop) => (
                              <div
                                key={shop.id}
                                className="flex items-center gap-2 text-sm p-1.5 bg-muted rounded"
                              >
                                <TierBadge tier={shop.tier} size="sm" />
                                <span className="flex-1">{shop.name}</span>
                                {shop.whatsapp && (
                                  <a
                                    href={formatWhatsAppLink(shop.whatsapp)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <MessageCircle className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* End */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{trip.route.estimatedEndTime} END</p>
                <p className="text-sm text-muted-foreground">
                  Return to start point
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Planning UI */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Starting Point</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={startAddress}
                    onChange={(e) => setStartAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Latitude</label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={startLat}
                      onChange={(e) => setStartLat(parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Longitude</label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={startLng}
                      onChange={(e) => setStartLng(parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Departure Time</label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Transport</label>
                  <div className="flex gap-2 mt-1">
                    {[
                      { mode: "motorcycle" as const, icon: Bike, label: "Motor" },
                      { mode: "car" as const, icon: Car, label: "Car" },
                      { mode: "public" as const, icon: Bus, label: "Public" },
                    ].map(({ mode, icon: Icon, label }) => (
                      <Button
                        key={mode}
                        variant={
                          transportMode === mode ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setTransportMode(mode)}
                        className="flex-1"
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trip Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {selectedClusterIds.size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    clusters selected
                  </p>
                  <p className="text-lg font-medium mt-1">
                    ~{selectedShopCount} shops
                  </p>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={generateTrip}
                  disabled={selectedClusterIds.size === 0 || generating}
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Route className="h-4 w-4 mr-2" />
                  )}
                  Generate Optimized Route
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Cluster Selection */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold">Select Clusters to Visit</h2>
            {clusters.map((cluster) => {
              const shopCount =
                cluster.shops?.length || cluster._count?.shops || 0;
              const isSelected = selectedClusterIds.has(cluster.id);
              const isExpanded = expandedClusters.has(cluster.id);
              const tierSCount =
                cluster.shops?.filter((s) => s.tier === "S").length || 0;
              const tierACount =
                cluster.shops?.filter((s) => s.tier === "A").length || 0;

              return (
                <Card
                  key={cluster.id}
                  className={`transition-all ${isSelected ? "ring-2 ring-blue-500 bg-blue-50/50" : ""}`}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleCluster(cluster.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{cluster.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {cluster.address}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <Badge variant="secondary">
                              {shopCount} shops
                            </Badge>
                            {cluster.type === "mall" && (
                              <Badge variant="outline" className="ml-1">
                                Mall
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {tierSCount > 0 && (
                            <span className="flex items-center gap-1">
                              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">
                                S
                              </span>
                              {tierSCount}
                            </span>
                          )}
                          {tierACount > 0 && (
                            <span className="flex items-center gap-1">
                              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">
                                A
                              </span>
                              {tierACount}
                            </span>
                          )}
                          {cluster.parkingInfo && (
                            <span>🅿️ {cluster.parkingInfo}</span>
                          )}
                          {cluster.bestVisitTime && (
                            <span>
                              <Clock className="h-3 w-3 inline" />{" "}
                              {cluster.bestVisitTime}
                            </span>
                          )}
                        </div>

                        {cluster.shops && cluster.shops.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-auto py-1 px-2"
                            onClick={() => toggleExpand(cluster.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ChevronDown className="h-3 w-3 mr-1" />
                            )}
                            {isExpanded ? "Hide" : "Show"} shops
                          </Button>
                        )}

                        {isExpanded && cluster.shops && (
                          <div className="mt-2 space-y-1.5">
                            {cluster.shops.map((shop) => (
                              <div
                                key={shop.id}
                                className="flex items-center gap-2 text-sm p-2 bg-white rounded border"
                              >
                                <TierBadge tier={shop.tier} size="sm" />
                                <span className="flex-1 min-w-0 truncate">
                                  {shop.name}
                                </span>
                                {shop.googleRating && (
                                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground flex-shrink-0">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {shop.googleRating}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
