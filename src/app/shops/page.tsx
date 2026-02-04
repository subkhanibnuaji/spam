"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Star,
  MapPin,
  Clock,
  Phone,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  X,
  Home,
  Truck,
  Shield,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { TierBadge } from "@/components/shops/tier-badge";
import { RatingDisplay } from "@/components/shops/rating-display";
import { ContactButtons } from "@/components/shops/contact-buttons";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { TIER_CONFIG, TierKey, DISTRICTS } from "@/lib/constants";
import { parseJsonArray, isOpenNow, formatCurrency } from "@/lib/utils";
import type { Shop, ShopsResponse } from "@/types";

export default function ShopsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loading size="lg" /></div>}>
      <ShopsContent />
    </Suspense>
  );
}

function ShopsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [tierCounts, setTierCounts] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [selectedTiers, setSelectedTiers] = useState<string[]>(
    searchParams.get("tier") ? [searchParams.get("tier")!] : []
  );
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [homeServiceOnly, setHomeServiceOnly] = useState(false);
  const [pickupOnly, setPickupOnly] = useState(false);
  const [surfaceConfirmedOnly, setSurfaceConfirmedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const fetchShops = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (selectedTiers.length === 1) params.set("tier", selectedTiers[0]);
    if (selectedDistricts.length === 1)
      params.set("district", selectedDistricts[0]);
    if (homeServiceOnly) params.set("hasHomeService", "true");
    if (surfaceConfirmedOnly) params.set("surfaceConfirmed", "true");
    if (searchQuery) params.set("search", searchQuery);
    params.set("sortBy", sortBy);
    params.set("sortOrder", "desc");
    params.set("limit", "100");

    try {
      const res = await fetch(`/betulinlaptop/api/shops?${params.toString()}`);
      const data: ShopsResponse = await res.json();

      let filtered = data.data;

      // Client-side multi-tier filter
      if (selectedTiers.length > 1) {
        filtered = filtered.filter((s) => selectedTiers.includes(s.tier));
      }
      // Client-side multi-district filter
      if (selectedDistricts.length > 1) {
        filtered = filtered.filter((s) =>
          selectedDistricts.includes(s.district)
        );
      }
      if (pickupOnly) {
        filtered = filtered.filter((s) => s.hasPickupDelivery);
      }

      setShops(filtered);
      setPagination(data.pagination);
      setTierCounts(data.meta.tierCounts);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
    } finally {
      setLoading(false);
    }
  }, [
    selectedTiers,
    selectedDistricts,
    homeServiceOnly,
    pickupOnly,
    surfaceConfirmedOnly,
    searchQuery,
    sortBy,
  ]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const toggleTier = (tier: string) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  const toggleDistrict = (district: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };

  const clearFilters = () => {
    setSelectedTiers([]);
    setSelectedDistricts([]);
    setHomeServiceOnly(false);
    setPickupOnly(false);
    setSurfaceConfirmedOnly(false);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedTiers.length > 0 ||
    selectedDistricts.length > 0 ||
    homeServiceOnly ||
    pickupOnly ||
    surfaceConfirmedOnly ||
    searchQuery;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Store className="h-6 w-6" />
            Shop Database
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {shops.length} repair shops found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
          <div className="hidden sm:flex items-center gap-1 border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside
          className={`${
            showFilters ? "fixed inset-0 z-40 bg-white p-4 overflow-auto" : "hidden"
          } md:block md:relative md:bg-transparent md:p-0 md:w-64 flex-shrink-0`}
        >
          <div className="md:sticky md:top-20">
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h2 className="font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="rating">Rating</option>
                <option value="reviews">Reviews</option>
                <option value="name">Name</option>
              </select>
            </div>

            <Separator className="my-4" />

            {/* Tier Filter */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Tier</h3>
              <div className="space-y-2">
                {(Object.keys(TIER_CONFIG) as TierKey[]).map((tier) => (
                  <label
                    key={tier}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedTiers.includes(tier)}
                      onCheckedChange={() => toggleTier(tier)}
                    />
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${TIER_CONFIG[tier].bg} ${TIER_CONFIG[tier].text}`}
                    >
                      {tier}
                    </span>
                    <span className="text-sm">{TIER_CONFIG[tier].label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* District Filter */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">District</h3>
              <div className="space-y-2">
                {DISTRICTS.map((district) => (
                  <label
                    key={district}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedDistricts.includes(district)}
                      onCheckedChange={() => toggleDistrict(district)}
                    />
                    <span className="text-sm">{district}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Feature Filters */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Features</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={surfaceConfirmedOnly}
                    onCheckedChange={(checked) =>
                      setSurfaceConfirmedOnly(!!checked)
                    }
                  />
                  <Shield className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Surface Confirmed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={homeServiceOnly}
                    onCheckedChange={(checked) =>
                      setHomeServiceOnly(!!checked)
                    }
                  />
                  <Home className="h-4 w-4" />
                  <span className="text-sm">Home Service</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={pickupOnly}
                    onCheckedChange={(checked) => setPickupOnly(!!checked)}
                  />
                  <Truck className="h-4 w-4" />
                  <span className="text-sm">Pickup/Delivery</span>
                </label>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearFilters}
              >
                <X className="h-3 w-3 mr-1" />
                Clear All Filters
              </Button>
            )}
          </div>
        </aside>

        {/* Shop List */}
        <div className="flex-1 min-w-0">
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTiers.map((tier) => (
                <Badge
                  key={tier}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleTier(tier)}
                >
                  Tier {tier} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {selectedDistricts.map((d) => (
                <Badge
                  key={d}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleDistrict(d)}
                >
                  {d} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {surfaceConfirmedOnly && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setSurfaceConfirmedOnly(false)}
                >
                  Surface Confirmed <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loading size="lg" />
            </div>
          ) : shops.length === 0 ? (
            <EmptyState
              icon={Store}
              title="No shops found"
              description="Try adjusting your filters or search query"
              action={
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              }
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {shops.map((shop) => (
                <ShopListItem key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShopCard({ shop }: { shop: Shop }) {
  const services = parseJsonArray(shop.services);
  const tierConfig = TIER_CONFIG[shop.tier as TierKey];
  const open = isOpenNow(shop.operatingHours);

  return (
    <Link href={`/shops/${shop.id}`}>
      <Card
        className={`hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full border-l-4 ${tierConfig.borderColor}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <TierBadge tier={shop.tier} size="sm" />
                <CardTitle className="text-sm line-clamp-1">
                  {shop.name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="line-clamp-1">
                  {shop.area}, {shop.district}
                </span>
              </div>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                open
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {open ? "Open" : "Closed"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <RatingDisplay
            rating={shop.googleRating}
            reviews={shop.googleReviews}
          />

          {shop.tierReason && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-2 mb-2">
              {shop.tierReason}
            </p>
          )}

          {(shop.lcdPriceMin || shop.lcdPriceMax) && (
            <p className="text-xs font-medium text-blue-600 mb-2">
              LCD: {shop.lcdPriceMin ? formatCurrency(shop.lcdPriceMin) : "?"} -{" "}
              {shop.lcdPriceMax ? formatCurrency(shop.lcdPriceMax) : "?"}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {services.slice(0, 3).map((service) => (
              <Badge key={service} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
            {services.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{services.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            {shop.warrantyDays && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {shop.warrantyDays}d
              </span>
            )}
            {shop.hasHomeService && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Home className="h-3 w-3" />
                Home
              </span>
            )}
            {shop.surfaceConfirmed && (
              <Badge
                variant="secondary"
                className="text-xs bg-amber-50 text-amber-700"
              >
                Surface OK
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ShopListItem({ shop }: { shop: Shop }) {
  const services = parseJsonArray(shop.services);
  const tierConfig = TIER_CONFIG[shop.tier as TierKey];
  const open = isOpenNow(shop.operatingHours);

  return (
    <Link href={`/shops/${shop.id}`}>
      <Card
        className={`hover:shadow-md transition-all cursor-pointer border-l-4 ${tierConfig.borderColor}`}
      >
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <TierBadge tier={shop.tier} size="sm" />
                <h3 className="font-medium text-sm line-clamp-1">
                  {shop.name}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    open
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {open ? "Open" : "Closed"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {shop.area}, {shop.district}
                </span>
                <RatingDisplay
                  rating={shop.googleRating}
                  reviews={shop.googleReviews}
                />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {shop.tierReason}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              {shop.lcdPriceMin && (
                <p className="text-xs font-medium text-blue-600">
                  from {formatCurrency(shop.lcdPriceMin)}
                </p>
              )}
              {shop.warrantyDays && (
                <p className="text-xs text-muted-foreground">
                  {shop.warrantyDays}d warranty
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
