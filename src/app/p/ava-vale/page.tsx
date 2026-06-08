import Image from "next/image";
import { AvaValeSubscribeForm } from "@/components/public/ava-vale-subscribe-form";

export const metadata = {
  title: "Ava Vale Inner Circle",
  description:
    "Exclusive bonus scenes, deleted moments, early previews, and little pieces of the world that exist just beyond the final page.",
};

const benefits = [
  {
    icon: "♡",
    title: "The Scenes That Stayed With Me",
    body: "Exclusive bonus moments I wrote and couldn't let go of. Yours the instant you join.",
  },
  {
    icon: "♡",
    title: "What Happened After",
    body: "Deleted chapters and the quiet conversations that kept going beyond the final page.",
  },
  {
    icon: "♡",
    title: "First to Know",
    body: "Every new love story reaches you before it reaches the rest of the world.",
  },
  {
    icon: "♡",
    title: "Letters From Me",
    body: "Occasional personal notes — the kind I only write for the readers who stayed.",
  },
  {
    icon: "♡",
    title: "Little Surprises",
    body: "Seasonal gifts and exclusive extras, because some readers deserve something beautiful.",
  },
  {
    icon: "♡",
    title: "A Place to Return To",
    body: "The Inner Circle doesn't end. There is always more story waiting for you here.",
  },
];

export default function AvaValePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background-color: #FCFAF7;
          color: #2D2A28;
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .ava-page {
          background-color: #FCFAF7;
          min-height: 100vh;
        }

        /* ── HERO ── */
        .hero {
          max-width: 860px;
          margin: 0 auto;
          padding: 64px 32px 48px;
          text-align: center;
        }

        .hero-byline {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3em;
          color: #C8B28A;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .hero-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 300;
          color: #2D2A28;
          letter-spacing: 0.08em;
          line-height: 1;
          margin-bottom: 16px;
        }

        .hero-tagline {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.35em;
          color: #B8927A;
          text-transform: uppercase;
          margin-bottom: 32px;
        }

        .gold-rule {
          width: 48px;
          height: 1px;
          background: #C8B28A;
          margin: 0 auto 32px;
        }

        .hero-intro {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 300;
          font-style: italic;
          color: #4A3F38;
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto 36px;
        }

        /* ── PORTRAIT ── */
        .portrait-wrap {
          margin: 0 auto 40px;
          width: clamp(220px, 28vw, 360px);
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(100,70,50,0.14), 0 4px 16px rgba(100,70,50,0.08);
        }

        .portrait-wrap img {
          width: 100%;
          height: auto;
          display: block;
        }

        .hero-genre {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: #B8927A;
          text-transform: uppercase;
          margin-bottom: 40px;
        }

        .hero-cta-wrap {
          margin-bottom: 8px;
        }

        /* ── LETTER ── */
        .letter-section {
          max-width: 620px;
          margin: 0 auto;
          padding: 48px 32px 64px;
          text-align: center;
        }

        .letter {
          padding: 8px 0;
        }

        .letter-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          color: #C8B28A;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .letter-body {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 300;
          color: #4A3F38;
          line-height: 1.9;
        }

        .letter-body p {
          margin-bottom: 20px;
        }

        .letter-body p:last-child {
          margin-bottom: 0;
        }

        .letter-sig {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-style: italic;
          font-weight: 400;
          color: #B8927A;
          margin-top: 32px;
        }

        /* ── BEHIND CLOSED DOORS ── */
        .bcd-section {
          padding: 24px 32px 64px;
        }

        .bcd-card {
          max-width: 900px;
          margin: 0 auto;
          background: #FFFDFB;
          border: 1px solid rgba(200,178,138,0.25);
          border-radius: 8px;
          padding: 56px 64px;
          text-align: center;
          box-shadow: 0 4px 24px rgba(100,70,50,0.05);
        }

        .section-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.35em;
          color: #C8B28A;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .section-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 400;
          color: #2D2A28;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
        }

        .section-body {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 300;
          color: #6F625B;
          line-height: 1.85;
          max-width: 620px;
          margin: 0 auto;
        }

        /* ── BENEFITS GRID ── */
        .benefits-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 16px 32px 64px;
        }

        .benefits-heading {
          text-align: center;
          margin-bottom: 48px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .benefit-card {
          background: #FFFDFB;
          border: 1px solid rgba(200,178,138,0.2);
          border-radius: 8px;
          padding: 32px 28px;
          text-align: center;
          box-shadow: 0 2px 12px rgba(100,70,50,0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .benefit-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(100,70,50,0.1);
        }

        .benefit-icon {
          font-size: 20px;
          color: #B8927A;
          margin-bottom: 14px;
          display: block;
        }

        .benefit-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 500;
          color: #2D2A28;
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }

        .benefit-body {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: #6F625B;
          line-height: 1.7;
        }

        /* ── SIGNUP SECTION ── */
        .signup-section {
          background: #F5F0EA;
          padding: 72px 32px;
          text-align: center;
        }

        .signup-inner {
          max-width: 520px;
          margin: 0 auto;
        }

        .signup-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 300;
          font-style: italic;
          color: #2D2A28;
          margin-bottom: 16px;
        }

        .signup-body {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #6F625B;
          line-height: 1.8;
          margin-bottom: 40px;
        }

        /* ── FOOTER ── */
        .footer {
          border-top: 1px solid rgba(200,178,138,0.25);
          padding: 36px 32px;
          text-align: center;
        }

        .footer-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: #2D2A28;
          margin-bottom: 8px;
        }

        .footer-tagline {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.25em;
          color: #C8B28A;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .footer-copy {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: #C8B28A;
          letter-spacing: 0.1em;
        }

        /* ── MOBILE ── */
        @media (max-width: 700px) {
          .benefits-grid { grid-template-columns: 1fr; }
          .bcd-card { padding: 40px 28px; }
          .hero { padding: 48px 24px 36px; }
          .letter-section { padding: 40px 24px 48px; }
        }

        /* ── FADE UP ANIMATION ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease both; }
        .fade-up-2 { animation: fadeUp 0.8s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.8s 0.3s ease both; }
      `}</style>

      <div className="ava-page">

        {/* ── HERO ── */}
        <section className="hero">
          <p className="hero-byline fade-up">Inner Circle</p>
          <h1 className="hero-name fade-up">Ava Vale</h1>
          <p className="hero-tagline fade-up">
            Intoxicating Passion &nbsp;•&nbsp; Quiet Devotion &nbsp;•&nbsp; Lasting Love
          </p>
          <div className="gold-rule fade-up-2" />
          <p className="hero-intro fade-up-2">
            You know that feeling.<br /><br />
            When you meet someone and the rest of the room just... stops.<br />
            When you can't sleep because you need to know what happens next.<br />
            When you finish the last page and just sit there,<br />
            not ready to leave.<br /><br />
            <em>That feeling has a home.</em>
          </p>

          <p className="hero-genre fade-up-2">
            Steamy contemporary romance for women who want to feel everything.
          </p>

          <div className="portrait-wrap fade-up-3">
            <Image
              src="/images/ava-vale-web.png"
              alt="Ava Vale"
              width={400}
              height={600}
              priority
            />
          </div>

          <div className="hero-cta-wrap fade-up-3">
            <AvaValeSubscribeForm heroMode />
          </div>
        </section>

        {/* ── LETTER ── */}
        <section className="letter-section">
          <div className="letter">
            <p className="letter-label">A Letter from Ava</p>
            <div className="letter-body">
              <p>Hello, beautiful,</p>
              <p>
                If you've ever met someone and known —
                just <em>known</em> — in the very first moment,
                then you already understand everything I write about.
              </p>
              <p>
                That electric stillness. The way the room narrows
                to just the two of you. The feeling that your whole
                life has been quietly arranging itself toward this person.
              </p>
              <p>
                I write for women who are ready to feel it.<br />
                Who want to be completely consumed by a story.<br />
                Who need a love so real it makes their chest ache.
              </p>
              <p>
                The Inner Circle is where I share everything that doesn't
                fit between the covers. The scenes that got too hot for Amazon.
                The conversations that kept going after the final page.
                The moments that belong only to the readers who stayed.
              </p>
              <p>
                If you've ever finished one of my books and felt that
                small, sweet ache — the one that means you weren't
                quite ready to leave — then this is yours.
              </p>
              <p>
                I've been saving it for you.
              </p>
            </div>
            <p className="letter-sig">With love, Ava</p>
          </div>
        </section>

        {/* ── BEHIND CLOSED DOORS ── */}
        <section className="bcd-section">
          <div className="bcd-card">
            <p className="section-label">For readers who stay a little longer</p>
            <h2 className="section-heading">Behind Closed Doors</h2>
            <p className="section-body">
              The most intoxicating moments are the ones that never made it to print.
              The morning after. The conversation they almost didn't have.
              The second the characters realised there was no going back.
              Inside the Inner Circle, those moments are yours —
              because some love stories are too good to end on the final page.
            </p>
          </div>
        </section>

        {/* ── BENEFITS GRID ── */}
        <section className="benefits-section">
          <div className="benefits-heading">
            <p className="section-label">What awaits you</p>
            <h2 className="section-heading">Inside the Inner Circle</h2>
          </div>
          <div className="benefits-grid">
            {benefits.map((b) => (
              <div key={b.title} className="benefit-card">
                <span className="benefit-icon">{b.icon}</span>
                <p className="benefit-title">{b.title}</p>
                <p className="benefit-body">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SIGNUP ── */}
        <section className="signup-section">
          <div className="signup-inner">
            <h2 className="signup-heading">You weren't ready for it to end.</h2>
            <p className="signup-body">
              Neither was I.<br /><br />
              Leave me your name and I'll send your first exclusive scene
              straight to your inbox. A moment you haven't read yet.
              A little more time with characters you already love.
            </p>
            <AvaValeSubscribeForm signupMode />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <p className="footer-name">AVA VALE</p>
          <p className="footer-tagline">
            Intoxicating Passion &nbsp;·&nbsp; Quiet Devotion &nbsp;·&nbsp; Lasting Love
          </p>
          <p className="footer-copy">© Ava Vale &nbsp;·&nbsp; All Rights Reserved</p>
        </footer>

      </div>
    </>
  );
}
