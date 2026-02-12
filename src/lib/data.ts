import shopsData from "@/data/shops.json";
import clustersData from "@/data/clusters.json";

export interface ShopRecord {
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
  createdAt: string;
  updatedAt: string;
}

export interface ClusterRecord {
  id: string;
  name: string;
  type: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  avgVisitMinutes: number;
  parkingInfo: string | null;
  bestVisitTime: string | null;
  createdAt: string;
  updatedAt: string;
}

const shops: ShopRecord[] = shopsData as ShopRecord[];
const clusters: ClusterRecord[] = clustersData as ClusterRecord[];

// Shop queries
export function getAllShops(): ShopRecord[] {
  return shops;
}

export function getShopById(id: string): (ShopRecord & { cluster: ClusterRecord | null }) | null {
  const shop = shops.find((s) => s.id === id);
  if (!shop) return null;
  const cluster = shop.clusterId
    ? clusters.find((c) => c.id === shop.clusterId) || null
    : null;
  return { ...shop, cluster };
}

export function getShopCount(): number {
  return shops.length;
}

export function getClusterCount(): number {
  return clusters.length;
}

export function getShopsByTierGrouped(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of shops) {
    map[s.tier] = (map[s.tier] || 0) + 1;
  }
  return map;
}

export function getAvgRating(): number {
  const rated = shops.filter((s) => s.googleRating !== null);
  if (rated.length === 0) return 0;
  const sum = rated.reduce((acc, s) => acc + (s.googleRating || 0), 0);
  return sum / rated.length;
}

export function getAllShopsWithCluster(): (ShopRecord & { cluster: ClusterRecord | null })[] {
  return shops
    .map((shop) => ({
      ...shop,
      cluster: shop.clusterId
        ? clusters.find((c) => c.id === shop.clusterId) || null
        : null,
    }))
    .sort((a, b) => (b.googleRating || 0) - (a.googleRating || 0));
}

export function queryShops(params: {
  tier?: string;
  district?: string;
  clusterId?: string;
  hasHomeService?: boolean;
  surfaceConfirmed?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}): {
  data: ShopRecord[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  meta: { tierCounts: Record<string, number> };
} {
  let filtered = [...shops];

  if (params.tier) {
    filtered = filtered.filter((s) => s.tier === params.tier);
  }
  if (params.district) {
    filtered = filtered.filter((s) => s.district === params.district);
  }
  if (params.clusterId) {
    filtered = filtered.filter((s) => s.clusterId === params.clusterId);
  }
  if (params.hasHomeService !== undefined) {
    filtered = filtered.filter((s) => s.hasHomeService === params.hasHomeService);
  }
  if (params.surfaceConfirmed !== undefined) {
    filtered = filtered.filter(
      (s) => s.surfaceConfirmed === params.surfaceConfirmed
    );
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }

  const sortBy = params.sortBy || "googleRating";
  const sortOrder = params.sortOrder || "desc";
  filtered.sort((a, b) => {
    const aVal = (a as unknown as Record<string, unknown>)[sortBy];
    const bVal = (b as unknown as Record<string, unknown>)[sortBy];
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const total = filtered.length;
  const page = params.page || 1;
  const limit = params.limit || 20;
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;
  const data = filtered.slice(skip, skip + limit);

  const tierCounts = getShopsByTierGrouped();

  return { data, pagination: { total, page, limit, totalPages }, meta: { tierCounts } };
}

// Cluster queries
export function getAllClusters(): ClusterRecord[] {
  return clusters;
}

export function getClustersWithShops(): (ClusterRecord & {
  shops: ShopRecord[];
  _count: { shops: number };
})[] {
  return clusters
    .map((c) => {
      const clusterShops = shops
        .filter((s) => s.clusterId === c.id)
        .sort((a, b) => (b.googleRating || 0) - (a.googleRating || 0));
      return {
        ...c,
        shops: clusterShops,
        _count: { shops: clusterShops.length },
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getClusterById(id: string): (ClusterRecord & { shops: ShopRecord[] }) | null {
  const cluster = clusters.find((c) => c.id === id);
  if (!cluster) return null;
  const clusterShops = shops.filter((s) => s.clusterId === id);
  return { ...cluster, shops: clusterShops };
}

export function getShopsByIds(ids: string[]): ShopRecord[] {
  return shops.filter((s) => ids.includes(s.id));
}

export function getClustersByIds(ids: string[]): (ClusterRecord & { shops: ShopRecord[] })[] {
  return ids
    .map((id) => getClusterById(id))
    .filter((c): c is ClusterRecord & { shops: ShopRecord[] } => c !== null);
}
