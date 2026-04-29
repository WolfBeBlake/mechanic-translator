import React from "react";
import { Badge } from "@/components/ui/badge";
import { Verdict } from "@workspace/api-client-react";
import { CheckCircle2, AlertTriangle, Skull } from "lucide-react";

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  if (verdict === Verdict.suspicious) {
    return (
      <Badge variant="destructive" className="px-3 py-1 text-sm flex items-center gap-1.5 uppercase tracking-wider font-bold">
        <Skull className="w-4 h-4" /> Suspicious
      </Badge>
    );
  }
  if (verdict === Verdict.high) {
    return (
      <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 text-sm flex items-center gap-1.5 uppercase tracking-wider font-bold">
        <AlertTriangle className="w-4 h-4" /> Too High
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm flex items-center gap-1.5 uppercase tracking-wider font-bold">
      <CheckCircle2 className="w-4 h-4" /> Fair Price
    </Badge>
  );
}
