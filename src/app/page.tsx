import Link from "next/link";
import {
  Wrench,
  Store,
  MapPin,
  Star,
  Navigation,
  ArrowRight,
  Shield,
  Clock,
  Phone,
  Zap,
  Award,
  Building,
  Wallet,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import {
  getShopCount,
  getClusterCount,
  getShopsByTierGrouped,
  getAvgRating,
  getAllShopsWithCluster,
} from "@/lib/data";
import { TIER_CONFIG, TierKey, DEFAULT_START } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseJsonArray, calculateDistance } from "@/lib/utils";

function getStats() {
  const totalShops = getShopCount();
  const clusterCount = getClusterCount();
  const tierCountMap = getShopsByTierGrouped();
  const avgRating = getAvgRating();
  const allShops = getAllShopsWithCluster();

  // Get current hour to check open status
  const now = new Date();
  const currentHour = now.getHours();

  // Count open now
  const openNow = allShops.filter(shop => {
    try {
      const hours = JSON.parse(shop.operatingHours);
      const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const today = days[now.getDay()];
      const todayHours = hours[today];
      if (!todayHours || todayHours === 'closed') return false;
      const [open, close] = todayHours.split('-').map((t: string) => parseInt(t.split(':')[0]));
      return currentHour >= open && currentHour < close;
    } catch {
      return false;
    }
  }).length;

  const perfectRated = allShops.filter(s => s.googleRating === 5.0);
  const surfaceSpecialists = allShops.filter(s => s.tier === "1");

  const shopsWithDistance = allShops.map(shop => ({
    ...shop,
    distance: shop.latitude && shop.longitude
      ? calculateDistance(DEFAULT_START.lat, DEFAULT_START.lng, shop.latitude, shop.longitude)
      : 999
  })).sort((a, b) => a.distance - b.distance);

  return {
    totalShops,
    clusterCount,
    surfaceSpecialistCount: tierCountMap["1"] || 0,
    avgRating,
    surfaceSpecialists,
    tierCountMap,
    openNow,
    perfectRatedCount: perfectRated.length,
    perfectRated: perfectRated.slice(0, 3),
    closest: shopsWithDistance.slice(0, 5),
  };
}

export const dynamic = "force-dynamic";

export default function HomePage() {
  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
      {/* Hero Section */}
      <div className="mb-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Jakarta Surface Repair Route Planner
            </h1>
          </div>
        </div>
        <p className="text-blue-100 mb-6 max-w-2xl">
          {stats.totalShops} service centers terverifikasi untuk Microsoft Surface & laptop premium di Jakarta dan sekitarnya. Optimized route dari Kebayoran Baru.
        </p>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="text-2xl font-bold">{stats.totalShops}</div>
            <div className="text-sm text-blue-100">Total Services</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="text-2xl font-bold text-green-300">{stats.openNow}</div>
            <div className="text-sm text-blue-100">Open Now</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="text-2xl font-bold text-yellow-300">{stats.perfectRatedCount}</div>
            <div className="text-sm text-blue-100">Perfect 5.0</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
            <div className="text-sm text-blue-100">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Quick Routes Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Routes
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link href="/trip-planner?preset=surface">
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-red-200 bg-red-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm font-medium text-red-800">Surface Only</div>
                <div className="text-xs text-red-600">3 Zapplerepair</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/trip-planner?preset=morning">
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-orange-200 bg-orange-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">🌅</div>
                <div className="text-sm font-medium text-orange-800">Morning 08:00</div>
                <div className="text-xs text-orange-600">Early openers</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/trip-planner?preset=mall">
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-teal-200 bg-teal-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">🏬</div>
                <div className="text-sm font-medium text-teal-800">Mall Hopping</div>
                <div className="text-xs text-teal-600">ITC + Ambassador</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/trip-planner?preset=budget">
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-sm font-medium text-blue-800">Budget Route</div>
                <div className="text-xs text-blue-600">Mangga Dua</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/trip-planner?preset=closest">
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">📍</div>
                <div className="text-sm font-medium text-green-800">Closest 5</div>
                <div className="text-xs text-green-600">Nearest shops</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/trip-planner?preset=perfect">
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-sm font-medium text-yellow-800">Perfect 5.0</div>
                <div className="text-xs text-yellow-600">{stats.perfectRatedCount} shops</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Tier Overview - Compact */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Browse by Tier
          </h2>
          <Link href="/shops">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {(Object.keys(TIER_CONFIG) as TierKey[]).map((tier) => {
            const config = TIER_CONFIG[tier];
            const count = stats.tierCountMap[tier] || 0;
            return (
              <Link key={tier} href={`/shops?tier=${tier}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-1 ${config.bg} ${config.text}`}
                    >
                      {tier}
                    </span>
                    <p className="text-xs font-medium truncate">{config.label}</p>
                    <p className="text-xs text-muted-foreground">{count} shops</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Top Picks Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Top Picks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥇</span>
                <div>
                  <p className="text-xs text-muted-foreground">Best Overall</p>
                  <CardTitle className="text-base">Zapplerepair HQ</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-2">
                SATU-SATUNYA Surface Specialist Indonesia
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-red-50 text-red-700">Tier 1</Badge>
              </div>
              <Link href="/shops?tier=1" className="text-xs text-blue-600 flex items-center mt-2">
                View all Surface specialists <ChevronRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-xs text-muted-foreground">Closest to Start</p>
                  <CardTitle className="text-base">{stats.closest[0]?.name || 'ITC Fatmawati'}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-2">
                {stats.closest[0]?.distance?.toFixed(1) || '2.5'} km dari Kebayoran Baru
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{stats.closest[0]?.googleRating || '4.7'}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Tier {stats.closest[0]?.tier || '5'}
                </Badge>
              </div>
              <Link href="/shops?sort=distance" className="text-xs text-blue-600 flex items-center mt-2">
                View closest shops <ChevronRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <p className="text-xs text-muted-foreground">Perfect 5.0 Rating</p>
                  <CardTitle className="text-base">{stats.perfectRated[0]?.name || 'iRepair Computer'}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-2">
                {stats.perfectRatedCount} shops with perfect rating
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">5.0</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700">Perfect</Badge>
              </div>
              <Link href="/shops?rating=5" className="text-xs text-blue-600 flex items-center mt-2">
                View all 5.0 shops <ChevronRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Surface Specialists Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <h2 className="text-lg font-semibold">Surface Specialists (Tier 1)</h2>
          </div>
          <Link href="/shops?tier=1">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.surfaceSpecialists.map((shop) => {
            const services = parseJsonArray(shop.services);
            return (
              <Link key={shop.id} href={`/shops/${shop.id}`}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-red-600 text-white">
                            1
                          </span>
                          <CardTitle className="text-base line-clamp-1">
                            {shop.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{shop.area}, {shop.district}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 mb-3">
                      {shop.googleRating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {shop.googleRating}
                          </span>
                          {shop.googleReviews && (
                            <span className="text-xs text-muted-foreground">
                              ({shop.googleReviews})
                            </span>
                          )}
                        </div>
                      )}
                      {shop.surfaceConfirmed && (
                        <Badge
                          variant="secondary"
                          className="bg-red-50 text-red-700 text-xs"
                        >
                          Confirmed
                        </Badge>
                      )}
                    </div>

                    {shop.tierReason && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {shop.tierReason}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {services.slice(0, 3).map((service) => (
                        <Badge
                          key={service}
                          variant="outline"
                          className="text-xs"
                        >
                          {service}
                        </Badge>
                      ))}
                      {services.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{services.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                      {shop.warrantyDays && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{Math.floor(shop.warrantyDays / 30)}mo warranty</span>
                        </div>
                      )}
                      {shop.whatsapp && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                          <Phone className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Emergency Info Panel */}
      <div className="mb-8">
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-5 w-5" />
              Emergency Touchpad Issue Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-sm mb-2 text-amber-900">Before You Go Checklist:</h4>
                <ul className="space-y-1.5 text-sm text-amber-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600" />
                    Laptop + charger
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600" />
                    Data sudah di-backup
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600" />
                    Model Surface dicatat
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600" />
                    Budget ready (Rp 500K - 2.5jt)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600" />
                    HP charged untuk navigasi
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-amber-900">Price Estimates:</h4>
                <ul className="space-y-1.5 text-sm text-amber-800">
                  <li className="flex justify-between">
                    <span>LCD Replacement:</span>
                    <span className="font-medium">Rp 1.8 - 2.5jt</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Touchpad Repair:</span>
                    <span className="font-medium">Rp 500K - 1jt</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Labor Fee:</span>
                    <span className="font-medium">Rp 100-600K</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Warranty:</span>
                    <span className="font-medium">30-270 days</span>
                  </li>
                </ul>
                <p className="text-xs text-amber-600 mt-2">
                  * Quick fix: Beli wireless mouse dulu (Rp 50-200K)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Plan Your Repair Trip
              </h2>
              <p className="text-blue-100">
                Select multiple shops, optimize your route, and export to Google Maps.
                Motor-friendly with real-time open status.
              </p>
            </div>
            <Link href="/trip-planner">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 whitespace-nowrap"
              >
                <Navigation className="mr-2 h-5 w-5" />
                Start Trip Planner
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
