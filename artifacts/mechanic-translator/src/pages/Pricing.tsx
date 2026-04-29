import React from "react";
import { Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetMe, useCreateCheckoutSession } from "@workspace/api-client-react";
import { Check, Zap, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/react";

export default function Pricing() {
  const { data: me } = useGetMe();
  const createCheckout = useCreateCheckoutSession();
  const clerk = useClerk();

  const handleUpgrade = () => {
    createCheckout.mutate(undefined, {
      onSuccess: (data) => {
        if (data.url) {
          window.location.href = data.url;
        } else if (!data.configured) {
          toast({
            title: "Billing Setup Needed",
            description: data.message,
          });
        }
      }
    });
  };

  const isPro = me?.subscriptionTier === 'pro';

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto py-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Simple, honest pricing.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Save hundreds on your next mechanic bill for less than the cost of a coffee.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className={`flex flex-col ${isPro ? 'opacity-70' : 'border-2'}`}>
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription className="text-base">For your first emergency</CardDescription>
              <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                €0
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4 mt-4">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>2 free quote translations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Fair price estimates</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-xs font-bold">-</span>
                  <span>No history saved</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {!me ? (
                <Link href="/sign-up" className="w-full">
                  <Button variant="outline" className="w-full h-12 text-lg">Sign Up Free</Button>
                </Link>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg" 
                  disabled={true}
                >
                  {isPro ? 'Included' : 'Current Plan'}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className={`flex flex-col border-2 ${isPro ? 'border-primary shadow-xl bg-primary/5' : 'border-primary/50 shadow-lg relative'}`}>
            {!isPro && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Pro</CardTitle>
              <CardDescription className="text-base">Peace of mind for all your cars</CardDescription>
              <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                €4.99
                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4 mt-4 font-medium">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Unlimited quote translations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Save and manage full history</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Priority access to new features</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Support independent development</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {!me ? (
                <Link href="/sign-up" className="w-full">
                  <Button className="w-full h-12 text-lg">Sign Up to Upgrade</Button>
                </Link>
              ) : isPro ? (
                <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700" disabled>
                  <Check className="w-5 h-5 mr-2" /> Active Subscription
                </Button>
              ) : (
                <Button 
                  className="w-full h-12 text-lg text-white" 
                  onClick={handleUpgrade}
                  disabled={createCheckout.isPending}
                >
                  {createCheckout.isPending ? "Loading..." : "Upgrade to Pro"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" /> Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
