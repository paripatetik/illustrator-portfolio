import Image from "next/image";

export default function About() {
  return (
    <section className="section bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="t-section uppercase italic w-full text-center mb-10">
          The artist behind the stories
        </h2>

        <div className="about-grid">
          <div className="about-image-wrap">
            <Image
              src="/olena-2.png?v=2"
              alt="Olena holding a fish in a water bag"
              width={720}
              height={520}
              className="about-image"
              priority
              unoptimized
            />
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
