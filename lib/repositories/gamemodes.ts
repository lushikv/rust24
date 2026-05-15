import "server-only";

import { gamemodes } from "@/data/gamemodes";
import type { GameMode } from "@/types/content";

export async function getGameModes(): Promise<GameMode[]> {
  return gamemodes;
}

export async function getFeaturedGameModes(): Promise<GameMode[]> {
  return gamemodes.slice(0, 3);
}
