type MediaHiddenFieldsProps = {
  values: Record<string, string | null | undefined>;
};

export function MediaHiddenFields({ values }: MediaHiddenFieldsProps) {
  return (
    <>
      {Object.entries(values).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value ?? ""} />
      ))}
    </>
  );
}
