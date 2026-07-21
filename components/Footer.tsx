export default function Footer() {
  return (
    <footer id="contact" className="border-t border-foreground/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Let&apos;s talk</h2>
          <a
            href="mailto:you@example.com"
            className="mt-2 inline-block text-accent hover:underline"
          >
            you@example.com
          </a>
        </div>
        <ul className="flex gap-6 text-sm font-medium">
          <li>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
