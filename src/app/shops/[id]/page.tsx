import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Clock,
  Shield,
  Star,
  Calendar,
  Award,
  Home,
  Truck,
  MessageCircle,
  Navigation,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TierBadge } from "@/components/shops/tier-badge";
import { RatingDisplay } from "@/components/shops/rating-display";
import { ContactButtons } from "@/components/shops/contact-buttons";
import { TIER_CONFIG, TierKey } from "@/lib/constants";
import {
  formatCurrency,
  parseJsonArray,
  parseOperatingHours,
  isOpenNow,
} from "@/lib/utils";

async function getShop(id: string) {
  const shop = await prisma.shop.findUnique({
    where: { id },
    include: { cluster: true },
  });
  return shop;
}

export default async function ShopDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const shop = await getShop(params.id);

  if (!shop) {
    notFound();
  }

  const tierConfig = TIER_CONFIG[shop.tier as TierKey];
  const services = parseJsonArray(shop.services);
  const specializations = parseJsonArray(shop.specializations);
  const hours = parseOperatingHours(shop.operatingHours);
  const open = isOpenNow(shop.operatingHours);
  const dayLabels: Record<string, string> = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/shops">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to List
          </Button>
        </Link>
        <Link href={`/trip-planner?shopId=${shop.id}`}>
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-1" />
            Add to Trip Plan
          </Button>
        </Link>
      </div>

      {/* Shop Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TierBadge tier={shop.tier} size="lg" />
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              open
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {open ? "Open Now" : "Closed"}
          </span>
          {shop.surfaceConfirmed && (
            <Badge className="bg-amber-500 text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Surface Confirmed
            </Badge>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {shop.name}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {shop.area}, {shop.district}
          </span>
          {shop.yearsInBusiness && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {shop.yearsInBusiness} years in business
            </span>
          )}
          <RatingDisplay
            rating={shop.googleRating}
            reviews={shop.googleReviews}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Why This Shop */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Why This Shop (Tier {shop.tier})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`p-3 rounded-lg ${tierConfig.lightBg} ${tierConfig.lightText} text-sm`}
              >
                {shop.tierReason}
              </div>
              {shop.surfaceNotes && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <strong>Surface Notes:</strong> {shop.surfaceNotes}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          {(shop.lcdPriceMin || shop.lcdPriceMax || shop.laborFee) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Surface Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(shop.lcdPriceMin || shop.lcdPriceMax) && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">
                        LCD Replacement
                      </span>
                      <span className="font-medium">
                        {shop.lcdPriceMin
                          ? formatCurrency(shop.lcdPriceMin)
                          : "?"}{" "}
                        -{" "}
                        {shop.lcdPriceMax
                          ? formatCurrency(shop.lcdPriceMax)
                          : "?"}
                      </span>
                    </div>
                  )}
                  {shop.laborFee && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">
                        Labor Fee
                      </span>
                      <span className="font-medium">
                        {formatCurrency(shop.laborFee)}
                      </span>
                    </div>
                  )}
                  {shop.warrantyDays && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">
                        Warranty
                      </span>
                      <span className="font-medium">
                        {shop.warrantyDays} days
                        {shop.warrantyDays >= 270
                          ? " (9 months)"
                          : shop.warrantyDays >= 90
                            ? " (3 months)"
                            : ""}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <Badge key={service} variant="secondary" className="text-sm">
                    {service}
                  </Badge>
                ))}
              </div>
              {specializations.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {specializations.map((spec) => (
                      <Badge
                        key={spec}
                        variant="outline"
                        className="text-sm border-blue-300 text-blue-600"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  {shop.surfaceConfirmed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300" />
                  )}
                  <span className="text-sm">Surface Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  {shop.hasHomeService ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300" />
                  )}
                  <span className="text-sm">Home Service</span>
                </div>
                <div className="flex items-center gap-2">
                  {shop.hasPickupDelivery ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300" />
                  )}
                  <span className="text-sm">Pickup/Delivery</span>
                </div>
                {shop.certifications && (
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">{shop.certifications}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(dayLabels).map(([key, label]) => {
                  const dayHours = hours[key];
                  const today =
                    new Date()
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toLowerCase() === key;
                  return (
                    <div
                      key={key}
                      className={`flex justify-between items-center py-1.5 px-2 rounded ${
                        today ? "bg-blue-50 font-medium" : ""
                      }`}
                    >
                      <span className="text-sm">
                        {label} {today && "(Today)"}
                      </span>
                      <span
                        className={`text-sm ${
                          !dayHours || dayHours === "closed"
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {!dayHours || dayHours === "closed"
                          ? "Closed"
                          : dayHours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{shop.address}</p>
              <p className="text-sm text-muted-foreground mb-3">
                {shop.district}
              </p>
              {shop.cluster && (
                <div className="mb-3 p-2 bg-muted rounded text-sm">
                  <span className="font-medium">Cluster:</span>{" "}
                  {shop.cluster.name}
                  {shop.cluster.parkingInfo && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {shop.cluster.parkingInfo}
                    </p>
                  )}
                </div>
              )}
              {shop.latitude && shop.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <MapPin className="h-4 w-4 mr-1" />
                    Open in Google Maps
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContactButtons
                whatsapp={shop.whatsapp}
                phone={shop.phone}
                website={shop.website}
                instagram={shop.instagram}
                latitude={shop.latitude}
                longitude={shop.longitude}
              />
              {shop.instagram && shop.instagramFollowers && (
                <div className="mt-3 text-sm text-muted-foreground">
                  {shop.instagram} ({shop.instagramFollowers.toLocaleString()}{" "}
                  followers)
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Source */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">
                Data source: {shop.dataSource}
              </p>
              {shop.lastVerified && (
                <p className="text-xs text-muted-foreground">
                  Last verified:{" "}
                  {new Date(shop.lastVerified).toLocaleDateString()}
                </p>
              )}
              {shop.notes && (
                <p className="text-xs text-muted-foreground mt-1">
                  {shop.notes}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
