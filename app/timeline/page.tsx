export default function Timeline() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Timeline</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center p-8">
        <p className="text-muted-foreground">Timeline content goes here</p>
      </main>
    </div>
  );
}
