type SeoFieldsProps = {
  item?: {
    seoMetaTitle?: string | null;
    seoMetaDescription?: string | null;
    seoMetaLink?: string | null;
    seoKeywords?: string | null;
  } | null;
};

export function SeoFields({ item }: SeoFieldsProps) {
  return (
    <fieldset className="field-grid">
      <legend>SEO metadata</legend>
      <label>
        SEO Meta Title
        <input name="seoMetaTitle" defaultValue={item?.seoMetaTitle ?? ""} />
      </label>
      <label>
        SEO Meta Description
        <textarea name="seoMetaDescription" defaultValue={item?.seoMetaDescription ?? ""} />
      </label>
      <label>
        Canonical Meta Link
        <input name="seoMetaLink" defaultValue={item?.seoMetaLink ?? ""} />
      </label>
      <label>
        SEO Keywords
        <textarea name="seoKeywords" defaultValue={item?.seoKeywords ?? ""} />
      </label>
    </fieldset>
  );
}
