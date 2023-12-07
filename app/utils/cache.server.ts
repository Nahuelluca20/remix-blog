import type { CacheEntry } from "@epic-web/cachified";
import { lruCacheAdapter } from "@epic-web/cachified";
import { singleton } from "./singleton.server";
import { LRUCache } from "lru-cache";

const lru = singleton(
  "lru-cache",
  () => new LRUCache<string, CacheEntry<unknown>>({ max: 5000 })
);

export const lruCache = lruCacheAdapter(lru);
