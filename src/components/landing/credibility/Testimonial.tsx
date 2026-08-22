import type { LandingContentDraft } from "@/content"

type ApprovedTestimonial = Extract<
  LandingContentDraft["credibility"]["testimonials"][number],
  { approval: "approved" }
>

type TestimonialProps = {
  testimonial: ApprovedTestimonial
}

export function Testimonial({ testimonial }: TestimonialProps) {
  return (
    <figure className="testimonial">
      <blockquote>“{testimonial.quote}”</blockquote>
      <figcaption>
        <cite>{testimonial.name}</cite>
        <span>
          {testimonial.role}, {testimonial.company}
        </span>
        <small>{testimonial.source}</small>
      </figcaption>
    </figure>
  )
}

export type { ApprovedTestimonial, TestimonialProps }
