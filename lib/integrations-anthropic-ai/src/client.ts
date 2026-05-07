import Anthropic from "@anthropic-ai/sdk";

const apiKey =
  process.env.ANTHROPIC_API_KEY ??
  process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;

const baseURL =
  process.env.ANTHROPIC_API_KEY
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

export const anthropic = new Anthropic({ apiKey, baseURL });
