import React from "react";
import { Badge } from "@/components/ui/badge";
import { Urgency } from "@workspace/api-client-react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  if (urgency === Urgency.Critical) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1 font-semibold">
        <AlertCircle className="w-3.5 h-3.5" /> Critical
      </Badge>
    );
  }
  if (urgency === Urgency.Soon) {
    return (
      <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 font-semibold">
        <AlertTriangle className="w-3.5 h-3.5" /> Soon
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <Info className="w-3.5 h-3.5" /> Optional
    </Badge>
  );
}
