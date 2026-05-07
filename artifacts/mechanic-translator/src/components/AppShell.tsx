import React from "react";
import { Link, useLocation } from "wouter";
import { useClerk } from "@clerk/react";
import { useGetMe } from "@workspace/api-client-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Wrench, Menu, History, Sparkles, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: me } = useGetMe();
  const { signOut } = useClerk();
  const [location] = useLocation();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleSignOut = () => {
    signOut({ redirectUrl: basePath || "/" });
  };

  const navItems = [
    { href: "/app", label: "Translator", icon: Sparkles },
    { href: "/history", label: "History", icon: History },
    { href: "/pricing", label: "Pricing", icon: ShieldCheck },
  ];

  if (me?.isAdmin) {
    navItems.push({ href: "/admin", label: "Admin", icon: Wrench });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
              <Wrench className="w-6 h-6" />
              <span className="font-bold text-xl tracking-tight text-foreground hidden sm:inline-block">
                MechanicTranslator
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={location === item.href ? "secondary" : "ghost"}
                    className={`h-9 px-4 ${location === item.href ? "font-semibold" : "font-medium text-muted-foreground"}`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {me && me.subscriptionTier === 'free' && (
              <div className="hidden sm:flex items-center text-sm font-medium text-muted-foreground mr-2">
                <span className="bg-muted px-2.5 py-1 rounded-md border">
                  {me.translationsRemaining ?? 0} free translations left
                </span>
                <Link href="/pricing">
                  <Button variant="link" size="sm" className="text-primary h-8 ml-1">Upgrade</Button>
                </Link>
              </div>
            )}
            
            {me && me.subscriptionTier === 'pro' && (
              <Badge variant="outline" className="hidden sm:inline-flex bg-primary/10 text-primary border-primary/20">
                Pro · Unlimited
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {me?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{me?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {me?.subscriptionTier === 'pro' ? 'Pro Plan' : 'Free Plan'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="md:hidden">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="w-full cursor-pointer flex items-center">
                        <item.icon className="w-4 h-4 mr-2 text-muted-foreground" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </div>
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
