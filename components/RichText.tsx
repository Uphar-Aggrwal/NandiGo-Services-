export function RichText({ value }: { value: string }) {
  return (
    <div className="rich-text">
      {value
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean)
        .map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
    </div>
  );
}
