import "server-only";

import { getBaseUrl } from "@/lib/seo";

const STEAM_OPENID_ENDPOINT = "https://steamcommunity.com/openid/login";
const STEAM_ID_PATTERN = /^https:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/;

export type SteamProfileSummary = {
  steamId: string;
  personaName: string;
  avatarUrl: string | null;
  profileUrl: string | null;
};

function decodeXmlText(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function readXmlTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>\\s*(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))\\s*</${tag}>`, "i"));
  const value = match?.[1] ?? match?.[2];

  return value ? decodeXmlText(value.trim()) : null;
}

function steamProfileFallback(steamId: string): SteamProfileSummary {
  return {
    steamId,
    personaName: steamId,
    avatarUrl: null,
    profileUrl: `https://steamcommunity.com/profiles/${steamId}`
  };
}

export function getSteamRealm() {
  return process.env.STEAM_REALM ?? getBaseUrl();
}

export function getSteamReturnUrl() {
  return process.env.STEAM_RETURN_URL ?? `${getBaseUrl()}/api/auth/steam/callback`;
}

export function buildSteamLoginUrl({
  locale,
  returnTo
}: {
  locale: string;
  returnTo: string;
}) {
  const callbackUrl = new URL(getSteamReturnUrl());
  callbackUrl.searchParams.set("locale", locale);
  callbackUrl.searchParams.set("returnTo", returnTo);

  const url = new URL(STEAM_OPENID_ENDPOINT);
  url.searchParams.set("openid.ns", "http://specs.openid.net/auth/2.0");
  url.searchParams.set("openid.mode", "checkid_setup");
  url.searchParams.set("openid.return_to", callbackUrl.toString());
  url.searchParams.set("openid.realm", getSteamRealm());
  url.searchParams.set("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select");
  url.searchParams.set("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select");

  return url;
}

export function extractSteamId(params: URLSearchParams) {
  const claimedId = params.get("openid.claimed_id");
  const identity = params.get("openid.identity");
  const claimedMatch = claimedId?.match(STEAM_ID_PATTERN);
  const identityMatch = identity?.match(STEAM_ID_PATTERN);

  if (!claimedMatch || !identityMatch || claimedMatch[1] !== identityMatch[1]) {
    return null;
  }

  return claimedMatch[1];
}

export async function verifySteamOpenIdResponse(params: URLSearchParams) {
  if (params.get("openid.mode") !== "id_res") {
    return false;
  }

  const body = new URLSearchParams(params);
  body.set("openid.mode", "check_authentication");

  const response = await fetch(STEAM_OPENID_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body,
    cache: "no-store"
  });

  if (!response.ok) {
    return false;
  }

  const text = await response.text();
  return text.split(/\r?\n/).some((line) => line.trim() === "is_valid:true");
}

export async function fetchSteamProfile(steamId: string): Promise<SteamProfileSummary> {
  const apiKey = process.env.STEAM_API_KEY;

  if (!apiKey) {
    return fetchPublicSteamProfile(steamId);
  }

  const url = new URL("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamids", steamId);

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    return fetchPublicSteamProfile(steamId);
  }

  const data = (await response.json()) as {
    response?: {
      players?: Array<{
        personaname?: string;
        avatarfull?: string;
        profileurl?: string;
      }>;
    };
  };
  const player = data.response?.players?.[0];

  return {
    steamId,
    personaName: player?.personaname ?? steamId,
    avatarUrl: player?.avatarfull ?? null,
    profileUrl: player?.profileurl ?? `https://steamcommunity.com/profiles/${steamId}`
  };
}

async function fetchPublicSteamProfile(steamId: string): Promise<SteamProfileSummary> {
  const fallback = steamProfileFallback(steamId);

  try {
    const url = new URL(`https://steamcommunity.com/profiles/${steamId}`);
    url.searchParams.set("xml", "1");

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return fallback;
    }

    const xml = await response.text();

    return {
      steamId,
      personaName: readXmlTag(xml, "steamID") ?? fallback.personaName,
      avatarUrl: readXmlTag(xml, "avatarFull"),
      profileUrl: readXmlTag(xml, "steamID64")
        ? `https://steamcommunity.com/profiles/${steamId}`
        : fallback.profileUrl
    };
  } catch {
    return fallback;
  }
}
