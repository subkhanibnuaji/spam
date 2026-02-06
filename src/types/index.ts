export interface Shop {
  id: string;
  name: string;
  address: string;
  district: string;
  area: string;
  clusterId: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  instagram: string | null;
  instagramFollowers: number | null;
  googleRating: number | null;
  googleReviews: number | null;
  tier: string;
  tierReason: string;
  surfaceConfirmed: boolean;
  surfaceNotes: string | null;
  services: string;
  lcdPriceMin: number | null;
  lcdPriceMax: number | null;
  laborFee: number | null;
  warrantyDays: number | null;
  operatingHours: string;
  hasHomeService: boolean;
  hasPickupDelivery: boolean;
  yearsInBusiness: number | null;
  specializations: string | null;
  certifications: string | null;
  dataSource: string;
  lastVerified: string | null;
  notes: string | null;
  cluster?: Cluster | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cluster {
  id: string;
  name: string;
  type: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  shops?: Shop[];
  avgVisitMinutes: number;
  parkingInfo: string | null;
  bestVisitTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShopsResponse {
  data: Shop[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  meta: {
    tierCounts: Record<string, number>;
  };
}

export interface TripRequest {
  startLat: number;
  startLng: number;
  startTime: string;
  transportMode: "motorcycle" | "car" | "public";
  selectedClusterIds?: string[];
  selectedShopIds?: string[];
}

export interface TripStop {
  order: number;
  type: "shop" | "cluster";
  item: Shop | Cluster;
  arrivalTime: string;
  departureTime: string;
  visitDuration: number;
  distanceFromPrevious: number;
  durationFromPrevious: number;
  warnings: string[];
}

export interface TripResponse {
  tripId: string;
  route: {
    totalDistance: number;
    totalDuration: number;
    estimatedEndTime: string;
    stops: TripStop[];
  };
  warnings: string[];
}
