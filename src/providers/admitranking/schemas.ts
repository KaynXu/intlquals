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
  curriculumLabels: z.array(z.string()).optional()
});
