import React from "react";
import { Link, useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { useGetTranslation, useDeleteTranslation } from "@workspace/api-client-react";
import { TranslationResultView } from "@/components/TranslationResultView";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft, Trash2, ChevronRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListTranslationsQueryKey } from "@workspace/api-client-react";

export default function HistoryDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const { data: translation, isLoading } = useGetTranslation(id);
  const deleteMutation = useDeleteTranslation();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Translation deleted" });
        queryClient.invalidateQueries({ queryKey: getListTranslationsQueryKey() });
        setLocation("/history");
      },
      onError: () => {
        toast({ title: "Failed to delete", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-64 bg-muted/40 rounded-xl" />
          <div className="h-96 bg-muted/40 rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!translation) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Translation not found</h2>
          <Link href="/history">
            <Button variant="outline">Return to history</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-center gap-2 mb-8 text-sm font-medium text-muted-foreground">
          <Link href="/history" className="hover:text-foreground transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> History
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span>{format(new Date(translation.createdAt), "MMMM d, yyyy")}</span>
        </div>

        <div className="flex justify-between items-start mb-6 gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Translation Details</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this translation from your history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {deleteMutation.isPending ? "Deleting..." : "Delete Translation"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mb-10">
          <div className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Original Input</div>
          <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm leading-relaxed border border-border/50 max-h-60 overflow-y-auto">
            {translation.inputText}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Result</div>
          <TranslationResultView result={translation.result} />
        </div>
      </div>
    </AppShell>
  );
}
