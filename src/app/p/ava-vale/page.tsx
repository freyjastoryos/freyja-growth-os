import Image from "next/image";
import { AvaValeSubscribeForm } from "@/components/public/ava-vale-subscribe-form";

export const metadata = {
  title: "Ava Vale · You Found the Secret Door",
  description:
    "Most readers never find it. Behind the Secret Door is the world of Ava Vale — where the stories are only the beginning.",
};

export default function AvaValePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500&family=Great+Vibes&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
          background-color: #FDF7F2;
          color: #2D2A28;
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .ava-page {
          background-color: #FDF7F2;
          min-height: 100vh;
        }

        /* ── TOP RIBBON ── */
        .ribbon {
          background: #2D2A28;
          padding: 9px 24px;
          text-align: center;
        }
        .ribbon-text {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.3em;
          color: #C8B28A;
          text-transform: uppercase;
        }

        /* ── HERO ── */
        .hero {
          max-width: 620px;
          margin: 0 auto;
          padding: 80px 40px 88px;
          text-align: center;
        }

        /* Portrait — small circle */
        .portrait-circle {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 36px;
          border: 1px solid rgba(200,178,138,0.4);
          box-shadow: 0 4px 20px rgba(100,70,50,0.1);
        }
        .portrait-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          filter: sepia(10%) saturate(85%);
        }

        /* Welcome label */
        .welcome-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.4em;
          color: #C8B28A;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: block;
        }

        /* Secret Door headline */
        .secret-door-heading {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(48px, 8vw, 76px);
          font-weight: 400;
          color: #2D2A28;
          line-height: 1.1;
          margin-bottom: 40px;
        }

        /* Gold rule */
        .gold-rule {
          width: 48px;
          height: 1px;
          background: rgba(200,178,138,0.7);
          margin: 0 auto 40px;
        }

        /* ── LETTER ── */
        .letter-body {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 2.2vw, 22px);
          font-weight: 300;
          color: #3D3430;
          line-height: 1.9;
          text-align: left;
          margin-bottom: 36px;
        }

        .letter-body p {
          margin-bottom: 24px;
        }

        .letter-body p:last-child {
          margin-bottom: 0;
        }

        .letter-sign-wrap {
          text-align: right;
          margin-bottom: 52px;
        }

        .letter-sign-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.25em;
          color: #C8B28A;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .letter-sig {
          font-family: 'Great Vibes', cursive;
          font-size: 44px;
          color: #B8927A;
          line-height: 1.2;
          display: block;
        }

        /* ── FOOTER ── */
        .footer {
          background: #2D2A28;
          padding: 52px 32px 44px;
          text-align: center;
        }

        .footer-portrait {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 20px;
          border: 1px solid rgba(200,178,138,0.3);
        }

        .footer-portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          filter: sepia(15%) saturate(80%) brightness(0.85);
        }

        .footer-name {
          font-family: 'Great Vibes', cursive;
          font-size: 36px;
          color: #FDF7F2;
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .footer-tagline {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(200,178,138,0.65);
          margin-bottom: 32px;
        }

        .social-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .social-link {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.18em;
          color: rgba(200,178,138,0.6);
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .social-link:hover { color: #C8B28A; }

        .social-dot {
          font-size: 6px;
          color: rgba(200,178,138,0.25);
        }

        .footer-copy {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          color: rgba(200,178,138,0.3);
          letter-spacing: 0.1em;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 1s ease both; }
        .fade-up-2 { animation: fadeUp 1s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 1s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 1s 0.45s ease both; }
        .fade-up-5 { animation: fadeUp 1s 0.6s ease both; }

        /* ── MOBILE ── */
        @media (max-width: 600px) {
          .hero { padding: 56px 28px 64px; }
          .social-dot { display: none; }
          .social-links { gap: 16px; }
        }
      `}</style>

      <div className="ava-page">

        {/* ── RIBBON ── */}
        <div className="ribbon">
          <span className="ribbon-text">A Private Invitation &nbsp;✦&nbsp; Ava Vale Inner Circle</span>
        </div>

        {/* ── HERO ── */}
        <section className="hero">

          <div className="portrait-circle fade-up">
            <Image
              src="/images/ava-vale-web.png"
              alt="Ava Vale"
              width={400}
              height={600}
              priority
            />
          </div>

          <span className="welcome-label fade-up">Welcome.</span>

          <h1 className="secret-door-heading fade-up-2">
            You found the Secret Door.
          </h1>

          <div className="gold-rule fade-up-2" />

          <div className="letter-body fade-up-3">
            <p>Most readers never find it.</p>
            <p>The stories are only the beginning.</p>
            <p>Behind the Secret Door is the world of Ava Vale.</p>
            <p>
              A place where readers linger a little longer after the final page.
              Where new stories arrive before they&apos;re announced.
              Where familiar faces return when you least expect them.
              Where there are still secrets to discover and surprises waiting to be shared.
              Some tender. Some unexpected.{" "}
              <em>Some best enjoyed after dark.</em>
            </p>
            <p>
              If you&apos;d like to step a little deeper into the world behind the books,
              the door is open.
            </p>
          </div>

          <div className="letter-sign-wrap fade-up-4">
            <span className="letter-sign-label">With love</span>
            <span className="letter-sig">Ava Vale</span>
          </div>

          <div className="fade-up-5">
            <AvaValeSubscribeForm signupMode />
          </div>

        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-portrait">
            <Image
              src="/images/ava-vale-web.png"
              alt="Ava Vale"
              width={400}
              height={600}
            />
          </div>
          <p className="footer-name">Ava Vale</p>
          <p className="footer-tagline">✨ Intoxicating Passion &nbsp;·&nbsp; Quiet Devotion &nbsp;·&nbsp; Lasting Love</p>

          <div className="social-links">
            <a href="https://www.facebook.com/AvaValeAuthor" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a>
            <span className="social-dot">✦</span>
            <a href="https://www.instagram.com/avavaleauthor" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
            <span className="social-dot">✦</span>
            <a href="https://www.tiktok.com/@avavaleauthor" target="_blank" rel="noopener noreferrer" className="social-link">TikTok</a>
            <span className="social-dot">✦</span>
            <a href="https://www.avavaleauthor.com" target="_blank" rel="noopener noreferrer" className="social-link">AvaValeAuthor.com</a>
          </div>

          <p className="footer-copy">©2025 Ava Vale &nbsp;·&nbsp; All Rights Reserved</p>
        </footer>

      </div>
    </>
  );
}
