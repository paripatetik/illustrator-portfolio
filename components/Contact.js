function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="contact-svg">
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
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="contact-svg">
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
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="contact-svg">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="contact-svg">
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
    <section className="section bg-cream" id="contact">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-10">Let&apos;s connect!</h2>

        <div className="contact-grid t-body">
          <div className="contact-list">
            <a href="mailto:olenaoprich@gmail.com" className="contact-item">
              <span className="contact-icon" style={{ "--icon-delay": "0s" }}>
                <MailIcon />
              </span>
              <span className="contact-text t-body">olenaoprich@gmail.com</span>
            </a>

            <a
              href="https://linkedin.com/in/olena-oprich"
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <span className="contact-icon" style={{ "--icon-delay": "0.15s" }}>
                <LinkedinIcon />
              </span>
              <span className="contact-text t-body">linkedin.com/in/olena-oprich</span>
            </a>

            <a
              href="https://instagram.com/oprich.art"
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <span className="contact-icon" style={{ "--icon-delay": "0.3s" }}>
                <InstagramIcon />
              </span>
              <span className="contact-text t-body">oprich.art</span>
            </a>

            <div className="contact-item">
              <span className="contact-icon" style={{ "--icon-delay": "0.45s" }}>
                <LocationIcon />
              </span>
              <span className="contact-text t-body">Ukraine, Kyiv</span>
            </div>
          </div>

          <form
            className="contact-form"
            action="mailto:olenaoprich@gmail.com"
            method="post"
            encType="text/plain"
          >
            <h3 className="contact-form-title">Send me a letter</h3>

            <label className="contact-label t-body" htmlFor="contact-name">
              Name
            </label>
            <input id="contact-name" name="name" type="text" required className="contact-input t-body" />

            <label className="contact-label t-body" htmlFor="contact-email">
              Email
            </label>
            <input id="contact-email" name="email" type="email" required className="contact-input t-body" />

            <label className="contact-label t-body" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              required
              className="contact-textarea t-body"
            />

            <button type="submit" className="contact-submit">
              Send Letter
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
