export const metadata = {
  title: "Ava Vale · Until Next Time",
};

export default function GoodbyePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Great+Vibes&family=Inter:wght@300;400&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background-color: #FDF7F2;
          color: #2D2A28;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 32px;
          text-align: center;
          background-color: #FDF7F2;
        }

        .gold-rule {
          width: 40px;
          height: 1px;
          background: rgba(200,178,138,0.6);
          margin: 0 auto 40px;
        }

        .heading {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(42px, 7vw, 64px);
          color: #2D2A28;
          line-height: 1.2;
          margin-bottom: 40px;
        }

        .body {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 2.2vw, 22px);
          font-weight: 300;
          color: #3D3430;
          line-height: 1.9;
          max-width: 480px;
          margin: 0 auto 40px;
        }

        .body p { margin-bottom: 20px; }
        .body p:last-child { margin-bottom: 0; }

        .sig {
          font-family: 'Great Vibes', cursive;
          font-size: 40px;
          color: #B8927A;
          line-height: 1.2;
        }
      `}</style>

      <div className="page">
        <div className="gold-rule" />
        <h1 className="heading">Until next time.</h1>
        <div className="body">
          <p>You&apos;ve been unsubscribed from the Ava Vale Inner Circle.</p>
          <p>Thank you for reading.</p>
          <p>
            <em>The Secret Door will always be here,<br />
            if you&apos;d like to return.</em>
          </p>
        </div>
        <span className="sig">Ava Vale</span>
      </div>
    </>
  );
}
