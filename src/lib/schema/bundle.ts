import * as z from "zod";

export const PurchaseSchema = z.object({
  id: z.number(),
  cost: z.number(),
  name: z.string(),
  type: z.enum(["CREDIT", "DEBIT"]),
});
