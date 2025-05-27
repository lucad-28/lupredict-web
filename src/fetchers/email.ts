"use server";
import { z } from "zod";

const resSchema = z.object({
  proba: z.number(),
  result: z.number().int().min(0).max(1),
});

export async function fetchVerifyMail(
  content: string
): Promise<{ result: "Spam" | "Ham"; proba: number }> {
  const res = await fetch(`${process.env.API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: content }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const json = await res.json();
  const parsed = resSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Invalid response format");
  }
  const { proba, result } = parsed.data;
  return { result: result === 1 ? "Spam" : "Ham", proba };
}
