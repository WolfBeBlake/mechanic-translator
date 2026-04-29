import React from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CreditCard } from "lucide-react";
import { useCreateCheckoutSession } from "@workspace/api-client-react";
import { toast } from "@/hooks/use-toast";

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaywallModal({ open, onOpenChange }: PaywallModalProps) {
  const createCheckout = useCreateCheckoutSession();

  const handleUpgrade = () => {
    createCheckout.mutate(undefined, {
      onSuccess: (data) => {
        if (data.url) {
          window.location.href = data.url;
        } else if (!data.configured) {
          toast({
            title: "Billing not configured",
            description: data.message,
            variant: "destructive"
          });
        }
      },
      onError: (err) => {
        toast({
          title: "Error starting checkout",
          description:
            (err as { error?: string })?.error || "An unexpected error occurred.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Free translations exhausted</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            You've used up your free translations. Upgrade to Pro for unlimited quote translations, full history access, and ad-free experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted p-4 rounded-lg my-4 text-sm">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary p-0.5 rounded-full"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
              Unlimited translations
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary p-0.5 rounded-full"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
              Save and access past quotes
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary p-0.5 rounded-full"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
              Support ongoing development
            </li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleUpgrade}
            disabled={createCheckout.isPending}
          >
            {createCheckout.isPending ? "Preparing checkout..." : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Upgrade to Pro (€4.99/mo)
              </>
            )}
          </Button>
          <Link href="/pricing" onClick={() => onOpenChange(false)}>
            <Button variant="ghost" className="w-full">
              View all features
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
