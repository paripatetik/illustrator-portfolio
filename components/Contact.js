function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="w-[1.45rem] h-[1.45rem] block flex-none">
      <path
        d="M3 6h18v12H3z M3 7l9 7 9-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="w-[1.45rem] h-[1.45rem] block flex-none">
      <path
        d="M7.2 9.2v8.4 M7.2 6.4a1.1 1.1 0 1 0 0 .01 M11.6 17.6V9.2h4.1c2 0 3.1 1.3 3.1 3.4v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="w-[1.45rem] h-[1.45rem] block flex-none">
      <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="w-[1.45rem] h-[1.45rem] block flex-none">
      <path
        d="M12 21s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.1" fill="currentColor" />
      <ellipse cx="12" cy="22" rx="5.8" ry="1.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}




export default function Contact() {
  return (
    <section className="section pb-5" id="contact">
      <div className="container mx-auto">
        <h2 className="section-title mb-10">Let&apos;s connect!</h2>

        <div className="flex flex-col items-start md:flex-row gap-8 md:gap-4 lg:gap-12 t-body max-w-[1200px]">
            {/* Форма */}
          <form
            className="w-full md:flex-[0_0_65%] rounded-[20px] border border-white/40 p-5 md:p-7"
            style={{ background: "var(--surface-rose)" }}
            action="mailto:olenaoprich@gmail.com"
            method="post"
            encType="text/plain"
          >
            <h3 className="text-center md:text-left">Send me a letter</h3>

            <label className="mt-4 block t-body text-foreground" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 t-body text-foreground outline-none transition focus:border-white/70 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.2)]"
            />

            <label className="mt-4 block t-body text-foreground" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 t-body text-foreground outline-none transition focus:border-white/70 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.2)]"
            />

            <label className="mt-4 block t-body text-foreground" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              required
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 t-body text-foreground outline-none transition focus:border-white/70 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.2)]"
            />

            <button type="submit" className="btn">
              Send Letter
            </button>
          </form>

          {/* Контакти */}
          <div className="flex w-full flex-col gap-3 md:gap-4">
            <a
              href="mailto:olenaoprich@gmail.com"
              className="inline-flex items-center gap-5 no-underline transition-transform duration-300 hover:translate-x-1 md:gap-3"
            >
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden text-white"
                style={{ background: "#c84b53", animation: "contactIconFloat 2.8s ease-in-out infinite", animationDelay: "0s" }}
              >
                <MailIcon />
              </span>
              <span className="t-body text-foreground">olenaoprich@gmail.com</span>
            </a>

            <a
              href="https://linkedin.com/in/olena-oprich"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-5 no-underline transition-transform duration-300 hover:translate-x-1 md:gap-3"
            >
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden text-white"
                style={{ background: "#c84b53", animation: "contactIconFloat 2.8s ease-in-out infinite", animationDelay: "0.15s" }}
              >
                <LinkedinIcon />
              </span>
              <span className="t-body text-foreground">linkedin.com/in/olena-oprich</span>
            </a>

            <a
              href="https://instagram.com/oprich.art"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-5 no-underline transition-transform duration-300 hover:translate-x-1 md:gap-3"
            >
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden text-white"
                style={{ background: "#c84b53", animation: "contactIconFloat 2.8s ease-in-out infinite", animationDelay: "0.3s" }}
              >
                <InstagramIcon />
              </span>
              <span className="t-body text-foreground">oprich.art</span>
            </a>

            <div className="inline-flex items-center gap-5 md:gap-3">
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden text-white"
                style={{ background: "#c84b53", animation: "contactIconFloat 2.8s ease-in-out infinite", animationDelay: "0.45s" }}
              >
                <LocationIcon />
              </span>
              <span className="t-body text-foreground">Ukraine, Kyiv</span>
            </div>
          </div>

        

        </div>
      </div>
    </section>
  );
}