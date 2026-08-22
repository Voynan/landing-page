import { z } from "zod"

const requiredText = z.string().trim().min(1)

export const contactInputSchema = z.object({
  name: requiredText,
  email: z.string().trim().email(),
  message: requiredText,
})

export const contactSubmissionSchema = contactInputSchema.extend({
  antispamToken: requiredText,
})

export const contactSubmissionResultSchema = z.object({
  submissionId: requiredText,
})

export type ContactInput = z.infer<typeof contactInputSchema>
export type ContactSubmissionResult = z.infer<
  typeof contactSubmissionResultSchema
>
