import { z } from "zod"

const boundedText = (max: number) => z.string().trim().min(1).max(max)

export const contactInputSchema = z.object({
  name: boundedText(100),
  email: z.string().trim().min(1).max(200).email(),
  message: boundedText(5000),
})

export const contactSubmissionSchema = contactInputSchema.extend({
  // Cloudflare documents 2048 as the maximum Turnstile token length.
  antispamToken: boundedText(2048),
})

export const contactSubmissionResultSchema = z.object({
  submissionId: boundedText(200),
})

export type ContactInput = z.infer<typeof contactInputSchema>
export type ContactSubmissionResult = z.infer<
  typeof contactSubmissionResultSchema
>

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>
