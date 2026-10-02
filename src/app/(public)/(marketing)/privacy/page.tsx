export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Privacy</h1>
      <p className="text-muted-foreground">
        The desk stores the account you register, the appointments you book, the
        bKash payment tied to each booking, and a prescription PDF when a doctor
        attaches one. There is no separate health chart.
      </p>
      <p className="text-muted-foreground">
        The newsletter field on the footer does not save your address. Sign-in
        keeps the access token in a cookie, not in browser storage. This page is
        a description of what the product stores. It is not a legal policy
        drafted by counsel.
      </p>
    </div>
  );
}
