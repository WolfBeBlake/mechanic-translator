import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, ShieldCheck, CheckCircle2, ArrowRight, Zap, Euro, Copy } from "lucide-react";
import { TranslationResultView } from "@/components/TranslationResultView";

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);

  const demoResult = {
    summary: "The mechanic is quoting you for standard 60k mile maintenance items, but they've added an unnecessary fuel system cleaning and the brake pad replacement is priced 40% higher than market average.",
    verdict: "high" as const,
    quotedTotal: 985,
    fairTotal: { min: 450, max: 620, currency: "EUR" },
    redFlags: [
      "Fuel system flush is a known upsell on modern cars and rarely needed at 60k miles.",
      "Labor rate on brake pads is calculated at 3 hours instead of the standard 1 hour."
    ],
    items: [
      {
        title: "Synthetic Oil Change & Filter",
        explanation: "Standard regular maintenance to keep your engine running smoothly.",
        urgency: "Soon" as const,
        fairPrice: { min: 80, max: 120, currency: "EUR" },
        quotedPrice: 115,
        flags: []
      },
      {
        title: "Front Brake Pads & Rotors",
        explanation: "Replacing the friction material that stops your car. Normal wear item.",
        urgency: "Critical" as const,
        fairPrice: { min: 250, max: 350, currency: "EUR" },
        quotedPrice: 520,
        flags: ["Price is exceptionally high for standard non-performance brakes."]
      },
      {
        title: "Complete Fuel System Flush",
        explanation: "A chemical cleaning of the fuel lines and injectors.",
        urgency: "Optional" as const,
        fairPrice: { min: 0, max: 0, currency: "EUR" },
        quotedPrice: 350,
        flags: ["Not required by manufacturer. High margin pure profit item for the shop."]
      }
    ],
    negotiationScript: "Hi. I'd like to proceed with the oil change and the brake pads, but I've shopped around and the going rate for those brakes is closer to €300. Can you match that? Also, I'm going to pass on the fuel system flush for now as it's not in the manufacturer maintenance schedule."
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="absolute top-0 w-full z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Wrench className="w-7 h-7" />
            <span className="font-bold text-2xl tracking-tight text-foreground">MechanicTranslator</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="font-medium text-base">Log in</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="font-medium text-base shadow-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
          
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <SparklesIcon className="w-4 h-4" /> The AI that knows cars
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              Stop getting <span className="text-primary relative whitespace-nowrap">
                <span className="relative z-10">ripped off</span>
                <svg className="absolute w-full h-3 -bottom-1 left-0 fill-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z"></path></svg>
              </span><br className="hidden md:block" /> by your mechanic.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Paste your confusing repair quote. We'll decode the jargon, tell you exactly what it should cost in the UK & Ireland, and give you the exact words to negotiate.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                  Translate a Quote Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg w-full sm:w-auto bg-white border-2"
                onClick={() => {
                  setShowDemo(true);
                  setTimeout(() => {
                    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                See how it works
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground font-medium">No credit card required • 2 free translations</p>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-20 bg-white border-y">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center md:text-left space-y-4">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-question w-7 h-7"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2"/><path d="M12 17h.01"/></svg>
                </div>
                <h3 className="text-xl font-bold">Confusing Jargon</h3>
                <p className="text-muted-foreground">Mechanics use terms like "VVT Solenoid" and "Canister Purge Valve" to make simple repairs sound complex and expensive.</p>
              </div>
              <div className="text-center md:text-left space-y-4">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <Euro className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold">Fake Urgency</h3>
                <p className="text-muted-foreground">"You can't drive this off the lot." We'll tell you what's actually dangerous vs what can wait until next year.</p>
              </div>
              <div className="text-center md:text-left space-y-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold">The "Clueless" Tax</h3>
                <p className="text-muted-foreground">If you don't know cars, you get charged more. We give you the script to sound like you have a brother in the business.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo-section" className="py-24 bg-gray-50 relative">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">See the Translation in Action</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Paste a quote like this, and here's exactly what you get back.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Input side */}
              <div className="lg:col-span-4 space-y-4">
                <Card className="shadow-lg border-muted h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4 font-semibold text-muted-foreground">
                      <Copy className="w-4 h-4" /> Mechanic's Quote
                    </div>
                    <div className="bg-yellow-50 text-yellow-900 p-4 rounded-md font-mono text-sm leading-relaxed flex-1 shadow-inner border border-yellow-200">
                      CUST STATES BRAKES GRINDING. INSPECT FOUND FRONT PADS 2MM ROTORS SCORED. REPLACE PADS & ROTORS - 520.00 EUR.<br/><br/>
                      REC 60K MILE SERVICE. R&R SYNTH OIL AND FLTR - 115.00 EUR.<br/><br/>
                      REC FUEL INJECTION SYS CLEANING - 350.00 EUR.<br/><br/>
                      TOTAL W/ TAX: 985.00 EUR.
                    </div>
                    {!showDemo && (
                      <Button className="w-full mt-6 shadow-md" size="lg" onClick={() => setShowDemo(true)}>
                        Translate this quote
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Output side */}
              <div className="lg:col-span-8">
                {!showDemo ? (
                  <div className="h-full min-h-[400px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-white/50">
                    <SparklesIcon className="w-12 h-12 mb-4 text-muted-foreground/40" />
                    <p className="font-medium text-lg">Click translate to see the magic</p>
                  </div>
                ) : (
                  <TranslationResultView result={demoResult} />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-foreground text-background text-center px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to save hundreds on your next service?</h2>
            <p className="text-xl text-muted/80 mb-10 max-w-2xl mx-auto">
              Join thousands of drivers who stopped overpaying and started negotiating with confidence.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="h-14 px-10 text-lg shadow-xl hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90">
                Get Your Free Translation
              </Button>
            </Link>
          </div>
        </section>

        <footer className="py-12 bg-gray-50 border-t text-center text-muted-foreground px-4">
          <div className="flex items-center justify-center gap-2 mb-4 text-foreground font-bold">
            <Wrench className="w-5 h-5 text-primary" />
            MechanicTranslator
          </div>
          <p>© {new Date().getFullYear()} MechanicTranslator. Not actual legal or mechanical advice.</p>
        </footer>
      </main>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
