import { query } from "lit/decorators.js";

/**
 * Alias for query(`[part=${partName}]`, cache)
 *
 * Default cache.
 */
export const part = (partName: string, cache = true) => query(`[part=${partName}]`, cache);
