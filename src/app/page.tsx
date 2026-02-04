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
} from "lucide-react";
import { prisma } from "@/lib/db";
import { TIER_CONFIG, TierKey } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseJsonArray } from "@/lib/utils";

async function getStats() {
  const [totalShops, clusters, tierCounts, topShops] = await Promise.all([
    prisma.shop.count(),
    prisma.cluster.count(),
    prisma.shop.groupBy({
      by: ["tier"],
      _count: { tier: true },
    }),
    prisma.shop.findMany({
      where: { tier: "S" },
      include: { cluster: true },
      orderBy: { googleRating: "desc" },
    }),
  ]);

  const avgRating = await prisma.shop.aggregate({
    _avg: { googleRating: true },
  });

  const tierCountMap: Record<string, number> = {};
  for (const t of tierCounts) {
    tierCountMap[t.tier] = t._count.tier;
  }

  return {
    totalShops,
    clusterCount: clusters,
    surfaceSpecialists: tierCountMap["S"] || 0,
    avgRating: avgRating._avg.googleRating || 0,
    topShops,
    tierCountMap,
  };
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Surface Repair Finder
          </h1>
        </div>
        <p className="text-lg text-gray-600 ml-14">
          Database lengkap tempat servis Microsoft Surface di Jakarta &amp;
          sekitarnya
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Store className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalShops}</p>
                <p className="text-sm text-muted-foreground">Total Shops</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.surfaceSpecialists}
                </p>
                <p className="text-sm text-muted-foreground">
                  Surface Specialists
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.clusterCount}</p>
                <p className="text-sm text-muted-foreground">
                  Location Clusters
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.avgRating.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {(Object.keys(TIER_CONFIG) as TierKey[]).map((tier) => {
          const config = TIER_CONFIG[tier];
          const count = stats.tierCountMap[tier] || 0;
          return (
            <Link key={tier} href={`/shops?tier=${tier}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${config.bg} ${config.text}`}
                      >
                        {tier}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{config.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {count} shops
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Surface Specialists Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-semibold">
              Surface Specialists (Tier S)
            </h2>
          </div>
          <Link href="/shops?tier=S">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.topShops.map((shop) => {
            const services = parseJsonArray(shop.services);
            return (
              <Link key={shop.id} href={`/shops/${shop.id}`}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-amber-500 text-white">
                            S
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
                          className="bg-amber-50 text-amber-700 text-xs"
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
                          <span>{shop.warrantyDays}d warranty</span>
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

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Plan Your Repair Trip
              </h2>
              <p className="text-blue-100">
                Visit multiple shops efficiently with our trip planner.
                Optimized routes, time estimates, and cluster-based planning.
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
