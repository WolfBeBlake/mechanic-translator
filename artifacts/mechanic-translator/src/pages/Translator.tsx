import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useTranslateQuote, useGetMe } from "@workspace/api-client-react";
import { PaywallModal } from "@/components/PaywallModal";
import { TranslationResultView } from "@/components/TranslationResultView";
import { useQueryClient } from "@tanstack/react-query";
import { getGetMeQueryKey, getListTranslationsQueryKey } from "@workspace/api-client-react";
import { Sparkles, ArrowRight, Upload } from "lucide-react";

const formSchema = z.object({
  inputText: z.string().min(10, "Please paste a longer quote or description so we can analyze it properly.").max(8000, "Quote is too long"),
});

export default function Translator() {
  const [showPaywall, setShowPaywall] = useState(false);
  const translate = useTranslateQuote();
  const queryClient = useQueryClient();
  const { data: me } = useGetMe();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputText: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    translate.mutate(
      { data: { inputText: values.inputText } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListTranslationsQueryKey() });
        },
        onError: (err) => {
          const e = err as { code?: string; status?: number };
          if (e?.code === "FREE_QUOTA_EXHAUSTED" || e?.status === 402) {
            setShowPaywall(true);
          }
        }
      }
    );
  }

  const isTranslating = translate.isPending;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Translate a Quote</h1>
          <p className="text-muted-foreground text-lg">
            Paste the exact text from your mechanic's estimate, invoice, or text message.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="inputText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="E.g. CUST STATES BRAKES GRINDING. INSPECT FOUND FRONT PADS 2MM ROTORS SCORED. REPLACE PADS & ROTORS - 520.00 EUR. REC 60K MILE SERVICE. R&R SYNTH OIL AND FLTR - 115.00 EUR..."
                        className="min-h-[250px] text-base resize-y font-mono bg-muted/30 focus-visible:ring-primary/50 border-muted-foreground/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground flex items-center gap-2 w-full sm:w-auto">
                  {me?.subscriptionTier === 'pro' ? (
                    <span className="text-primary font-medium flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Pro · Unlimited
                    </span>
                  ) : me?.subscriptionTier === 'free' ? (
                    <span className="bg-muted px-3 py-1.5 rounded-full font-medium border border-border/50">
                      {me.translationsRemaining ?? 0} free translations remaining
                    </span>
                  ) : null}
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto font-semibold text-base px-8 h-12 shadow-md hover:shadow-lg transition-all"
                  disabled={isTranslating}
                >
                  {isTranslating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Analyzing Jargon...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Translate
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {translate.isSuccess && translate.data && (
          <div id="result" className="mt-12 scroll-m-8">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Your Translation</h2>
            <TranslationResultView result={translate.data.result} />
          </div>
        )}

        <PaywallModal open={showPaywall} onOpenChange={setShowPaywall} />
      </div>
    </AppShell>
  );
}
