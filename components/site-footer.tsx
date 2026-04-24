export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/80 py-6 dark:border-neutral-800">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 text-sm text-neutral-500">
        <p>Designed for focused reading.</p>
        <p>{new Date().getFullYear()} Seungjohan</p>
      </div>
    </footer>
  );
}
