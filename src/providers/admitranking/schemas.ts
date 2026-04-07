import { z } from "zod";

export const admitRankingListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  etitle: z.string().optional(),
  year: z.number().optional()
});

export const admitRankingEntrySchema = z.object({
  id: z.number(),
  rank: z.number().optional(),
  title: z.string().optional(),
  titleEn: z.string().optional(),
  countryName: z.string().optional(),
  provinceName: z.string().optional(),
  cityName: z.string().optional(),
  curriculumLabels: z.array(z.string()).optional()
});
