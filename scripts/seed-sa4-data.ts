/**
 * SA4 Region and Postcode Mapping Seed Script
 *
 * This script populates the PostcodeMapping and SA4Region tables using ABS
 * (Australian Bureau of Statistics) correspondence data.
 *
 * DATA SOURCE:
 * Download the "Postcode 2021 to SA4 2021" correspondence CSV from:
 * https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads/correspondences
 *
 * Look for: "Postcode 2021 to Statistical Area Level 4 (SA4) 2021"
 *
 * EXPECTED CSV COLUMNS:
 * - POSTCODE         — 4-digit Australian postcode (e.g., "2000")
 * - SA4_CODE_2021    — SA4 region code (e.g., "117")
 * - SA4_NAME_2021    — SA4 region name (e.g., "Sydney - City and Inner South")
 * - STATE_NAME_2021  — State/Territory name (e.g., "New South Wales")
 * - RATIO            — Proportion of postcode that falls within the SA4
 *
 * You will also need a postcode-to-suburb mapping. One source:
 * https://www.matthewproctor.com/australian_postcodes
 * This provides: postcode, locality (suburb), state, latitude, longitude
 *
 * STEPS TO IMPLEMENT:
 * 1. Download both CSV files and place them in the scripts/ directory
 * 2. Install csv-parse: npm install csv-parse
 * 3. Parse the ABS correspondence CSV to build SA4 region data
 * 4. Parse the postcode CSV to build postcode-to-suburb mappings
 * 5. For each postcode, assign the SA4 with the highest RATIO
 * 6. Insert SA4Region records (unique by SA4 code)
 * 7. Insert PostcodeMapping records (unique by postcode)
 *
 * EXAMPLE IMPLEMENTATION:
 *
 * import { PrismaClient } from "@prisma/client";
 * import { parse } from "csv-parse/sync";
 * import fs from "fs";
 *
 * const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
 *
 * async function main() {
 *   const absData = parse(fs.readFileSync("scripts/postcode-sa4-correspondence.csv"), {
 *     columns: true,
 *     skip_empty_lines: true,
 *   });
 *
 *   // Group postcodes by SA4 and select highest-ratio SA4 per postcode
 *   const postcodeToSA4 = new Map<string, { sa4Code: string; sa4Name: string; state: string }>();
 *   const sa4Regions = new Map<string, { name: string; state: string; postcodes: string[] }>();
 *
 *   for (const row of absData) {
 *     const postcode = row.POSTCODE;
 *     const sa4Code = row.SA4_CODE_2021;
 *     const ratio = parseFloat(row.RATIO);
 *
 *     // Keep the SA4 with the highest ratio for each postcode
 *     const current = postcodeToSA4.get(postcode);
 *     if (!current || ratio > parseFloat(current.ratio)) {
 *       postcodeToSA4.set(postcode, {
 *         sa4Code,
 *         sa4Name: row.SA4_NAME_2021,
 *         state: row.STATE_NAME_2021,
 *         ratio: row.RATIO,
 *       });
 *     }
 *
 *     // Build SA4 region data
 *     if (!sa4Regions.has(sa4Code)) {
 *       sa4Regions.set(sa4Code, {
 *         name: row.SA4_NAME_2021,
 *         state: row.STATE_NAME_2021,
 *         postcodes: [],
 *       });
 *     }
 *     sa4Regions.get(sa4Code)!.postcodes.push(postcode);
 *   }
 *
 *   // Insert SA4 regions
 *   for (const [code, data] of sa4Regions) {
 *     await prisma.sA4Region.upsert({
 *       where: { code },
 *       update: { name: data.name, state: data.state, postcodes: [...new Set(data.postcodes)] },
 *       create: { code, name: data.name, state: data.state, postcodes: [...new Set(data.postcodes)] },
 *     });
 *   }
 *
 *   // Parse suburb/lat/lng data and insert PostcodeMappings
 *   // ... (parse the second CSV and join with SA4 data)
 * }
 */

console.log("SA4 seed script placeholder.");
console.log("See comments in this file for implementation instructions.");
console.log(
  "Download the ABS correspondence CSV and a postcode-suburb mapping CSV first."
);
