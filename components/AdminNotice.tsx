export function AdminNotice({ searchParams }: { searchParams?: { notice?: string; error?: string } }) {
  return (
    <>
      {searchParams?.notice ? <p className="notice">{searchParams.notice}</p> : null}
      {searchParams?.error ? <p className="notice error">{searchParams.error}</p> : null}
    </>
  );
}
