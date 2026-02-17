import Image from "next/image";

export default function About() {
  return (
    <section className="section bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="section-title about-title">
          The artist behind the stories
        </h2>

        <div className="about-stack">
          <div className="about-image-wrap">
            <Image
              src="/olena.jpg"
              alt="Olena portrait"
              width={620}
              height={760}
              className="about-image"
              priority
              unoptimized
            />
            <span className="about-bookmark" aria-hidden="true">
              <svg viewBox="0 0 40 58" role="presentation" focusable="false">
                <path
                  d="M8 4h24a3 3 0 0 1 3 3v45l-15-9-15 9V7a3 3 0 0 1 3-3z"
                  fill="#ffffff"
                />
              </svg>
            </span>
          </div>

          <div className="about-copy">
            <p className="about-text">
              I&apos;m a children&apos;s book illustrator from Ukraine, creating
              warm and expressive illustrations filled with heart and color.
            </p>

            <p className="about-text">
              I love bringing stories to life through emotional characters and
              cozy storytelling worlds.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
