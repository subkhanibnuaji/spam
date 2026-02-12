import { MetadataRoute } from "next";
import { getAllShops } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const shops = getAllShops();

  const shopUrls = shops.map((shop) => ({
    url: `https://spam-seven-iota.vercel.app/shops/${shop.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://spam-seven-iota.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://spam-seven-iota.vercel.app/shops",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://spam-seven-iota.vercel.app/trip-planner",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...shopUrls,
  ];
}
