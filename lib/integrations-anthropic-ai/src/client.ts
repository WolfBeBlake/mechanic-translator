import Anthropic from "@anthropic-ai/sdk";

let _instance: Anthropic | undefined;

function getInstance(): Anthropic {
  if (_instance) return _instance;

  const apiKey =
    process.env.ANTHROPIC_API_KEY ??
    process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;

  const baseURL = process.env.ANTHROPIC_API_KEY
    ? "https://api.anthropic.com"
    : process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;

  if (!apiKey) {
    throw new Error(
      "No Anthropic API key found. Set ANTHROPIC_API_KEY (standard) or " +
        "AI_INTEGRATIONS_ANTHROPIC_API_KEY (Replit proxy).",
    );
  }

  if (!baseURL) {
    throw new Error(
      "No Anthropic base URL found. Set ANTHROPIC_API_KEY to use api.anthropic.com " +
        "directly, or provision the Replit AI integration to set AI_INTEGRATIONS_ANTHROPIC_BASE_URL.",
    );
  }

  return (_instance = new Anthropic({ apiKey, baseURL }));
}

// Lazy proxy — validation and initialization happen on first use (during a request),
// not at module load time. This prevents startup crashes if env vars are not yet set.
export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop: string | symbol) {
    return (getInstance() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
