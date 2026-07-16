import { SafeImage } from "@/components/SafeImage";

type TestimonialCardProps = {
  item: {
    reviewerName: string;
    roleOrLocation: string;
    quote: string;
    rating: number;
    imageUrl?: string | null;
  };
};

export function TestimonialCard({ item }: TestimonialCardProps) {
  return (
    <article className="testimonial-card">
      <SafeImage src={item.imageUrl} alt={item.reviewerName} className="avatar" />
      <div>
        <p className="stars" aria-label={`${item.rating} star rating`}>
          {"★".repeat(Math.max(1, Math.min(item.rating, 5)))}
        </p>
        <blockquote>{item.quote}</blockquote>
        <strong>{item.reviewerName}</strong>
        <span>{item.roleOrLocation}</span>
      </div>
    </article>
  );
}
