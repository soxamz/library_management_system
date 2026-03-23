export function Footer() {
  return (
    <footer className="border-t bg-background/95">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-muted-foreground md:px-6">
        <p className="font-medium text-foreground">Sohom Mondal</p>
        <p>Roll Number: 2405234</p>
        <p>Section: CSE 33</p>
        <p>Academic Year: 2025-2026</p>
        <p>
          GitHub:{" "}
          <a
            href="https://github.com/soxamz"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            soxamz
          </a>
        </p>
      </div>
    </footer>
  );
}
