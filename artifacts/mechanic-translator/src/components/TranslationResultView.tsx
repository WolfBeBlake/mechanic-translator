import React, { useState } from "react";
import { TranslationResult } from "@workspace/api-client-react";
import { VerdictBadge } from "./VerdictBadge";
import { UrgencyBadge } from "./UrgencyBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Copy, CheckCircle2, ShieldAlert, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TranslationResultViewProps {
  result: TranslationResult;
}

export function TranslationResultView({ result }: TranslationResultViewProps) {
  const [copied, setCopied] = useState(false);

  const formatPrice = (amount: number | null | undefined, currency: string) => {
    if (amount === null || amount === undefined) return "Unknown";
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(result.negotiationScript);
    setCopied(true);
    toast({
      title: "Script copied",
      description: "You can now paste this into a message to your mechanic."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-t-4 border-t-primary shadow-md">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <CardTitle className="text-2xl mb-1">Diagnosis</CardTitle>
              <CardDescription className="text-base text-foreground/80">
                {result.summary}
              </CardDescription>
            </div>
            <VerdictBadge verdict={result.verdict} />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="bg-muted p-4 rounded-lg flex flex-wrap gap-6 mb-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">They Quoted</p>
              <p className="text-2xl font-bold font-mono">
                {result.quotedTotal !== null ? formatPrice(result.quotedTotal, result.fairTotal.currency) : "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Fair Range</p>
              <p className="text-2xl font-bold font-mono text-green-700 dark:text-green-500">
                {formatPrice(result.fairTotal.min, result.fairTotal.currency)} - {formatPrice(result.fairTotal.max, result.fairTotal.currency)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {result.redFlags && result.redFlags.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <ShieldAlert className="w-5 h-5" /> Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="font-medium">{flag}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" /> Line-by-Line Breakdown
        </h3>
        <div className="space-y-4">
          {result.items.map((item, idx) => (
            <Card key={idx} className="overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-muted-foreground mt-1">{item.explanation}</p>
                  </div>
                  <div className="shrink-0">
                    <UrgencyBadge urgency={item.urgency} />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex flex-wrap justify-between items-end gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground w-20">Quoted:</span>
                      <span className="font-mono font-medium">
                        {item.quotedPrice !== null ? formatPrice(item.quotedPrice, item.fairPrice.currency) : "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground w-20">Fair Price:</span>
                      <span className="font-mono font-medium text-green-700 dark:text-green-500">
                        {formatPrice(item.fairPrice.min, item.fairPrice.currency)} - {formatPrice(item.fairPrice.max, item.fairPrice.currency)}
                      </span>
                    </div>
                  </div>
                  
                  {item.flags && item.flags.length > 0 && (
                    <div className="text-sm bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 px-3 py-1.5 rounded-md flex-1 max-w-sm">
                      <div className="font-semibold mb-0.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Note
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {item.flags.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>What to say to the mechanic</span>
            <Button variant="secondary" size="sm" onClick={handleCopyScript} className="h-8 text-xs font-medium">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              {copied ? "Copied!" : "Copy Script"}
            </Button>
          </CardTitle>
          <CardDescription>Read this aloud or paste it into an email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-white dark:bg-black/40 rounded-md border border-border/50 font-serif italic text-lg leading-relaxed shadow-inner">
            "{result.negotiationScript}"
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
