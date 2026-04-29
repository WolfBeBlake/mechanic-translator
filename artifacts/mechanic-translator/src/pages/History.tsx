import React from "react";
import { Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { useListTranslations } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VerdictBadge } from "@/components/VerdictBadge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileSearch, ArrowRight } from "lucide-react";

export default function History() {
  const { data: translations, isLoading } = useListTranslations();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">History</h1>
            <p className="text-muted-foreground mt-1">Your past quote translations</p>
          </div>
          <Link href="/app">
            <Button>New Translation</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-32 bg-muted/40" />
              </Card>
            ))}
          </div>
        ) : translations?.length === 0 ? (
          <Card className="bg-muted/30 border-dashed border-2 py-16 text-center">
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <FileSearch className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl mb-2">No history yet</CardTitle>
              <CardDescription className="text-base max-w-sm mb-6">
                You haven't translated any mechanic quotes yet. Try pasting one in the translator!
              </CardDescription>
              <Link href="/app">
                <Button size="lg" className="shadow-sm">
                  Translate First Quote <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {translations?.map(t => (
              <Link key={t.id} href={`/history/${t.id}`}>
                <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded">
                            {format(new Date(t.createdAt), "MMM d, yyyy")}
                          </span>
                          <VerdictBadge verdict={t.result.verdict} />
                        </div>
                        <h3 className="font-semibold text-lg line-clamp-1">{t.result.summary}</h3>
                        <p className="text-sm text-muted-foreground font-mono truncate max-w-xl">
                          {t.inputText}
                        </p>
                      </div>
                      <div className="flex items-center text-primary font-medium whitespace-nowrap self-end sm:self-center">
                        <span className="group-hover:mr-1 transition-all">View Details</span>
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
