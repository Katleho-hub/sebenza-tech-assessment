import * as z from "zod";

export function formatZodError(error: z.ZodError) {
  return z.treeifyError(error);
}
