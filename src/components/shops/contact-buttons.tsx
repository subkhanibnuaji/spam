"use client";

import { MessageCircle, Phone, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatWhatsAppLink,
  formatGoogleMapsLink,
  formatPhoneLink,
} from "@/lib/utils";

interface ContactButtonsProps {
  whatsapp?: string | null;
  phone?: string | null;
  website?: string | null;
  instagram?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export function ContactButtons({
  whatsapp,
  phone,
  website,
  instagram,
  latitude,
  longitude,
}: ContactButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {whatsapp && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(formatWhatsAppLink(whatsapp), "_blank")}
          className="gap-1.5"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      )}

      {phone && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(formatPhoneLink(phone), "_blank")}
          className="gap-1.5"
        >
          <Phone className="h-4 w-4" />
          Call
        </Button>
      )}

      {website && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(website, "_blank")}
          className="gap-1.5"
        >
          <Globe className="h-4 w-4" />
          Website
        </Button>
      )}

      {instagram && (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            window.open(
              `https://instagram.com/${instagram.replace("@", "")}`,
              "_blank"
            )
          }
          className="gap-1.5"
        >
          <span className="text-sm font-medium">IG</span>
          Instagram
        </Button>
      )}

      {latitude != null && longitude != null && (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            window.open(formatGoogleMapsLink(latitude, longitude), "_blank")
          }
          className="gap-1.5"
        >
          <MapPin className="h-4 w-4" />
          Google Maps
        </Button>
      )}
    </div>
  );
}
