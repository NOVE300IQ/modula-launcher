export function getLoginSuccessHTML(title: string, body: string) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      --primary: #8b5cf6;
      --secondary: #fbbf24;
      --bg: #0f172a;
      --card-bg: rgba(30, 41, 59, 0.7);
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: radial-gradient(circle at top left, #1e1b4b, #0f172a);
      color: white;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    }
    .background-decor {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
    }
    .circle {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
    }
    .circle-1 {
      width: 400px;
      height: 400px;
      background: var(--primary);
      top: -100px;
      right: -100px;
      animation: float 20s infinite alternate;
    }
    .circle-2 {
      width: 300px;
      height: 300px;
      background: #4f46e5;
      bottom: -50px;
      left: -50px;
      animation: float 15s infinite alternate-reverse;
    }
    @keyframes float {
      from { transform: translate(0, 0); }
      to { transform: translate(50px, 50px); }
    }
    .card {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 3rem;
      border-radius: 2rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      max-width: 400px;
      width: 90%;
      animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .logo-container {
      margin-bottom: 2rem;
    }
    .logo {
      width: 80px;
      height: 80px;
      filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.5));
    }
    h1 {
      font-size: 2rem;
      margin: 0 0 1rem;
      background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }
    p {
      color: #94a3b8;
      font-size: 1.1rem;
      line-height: 1.6;
      margin: 0;
    }
    .timer {
      margin-top: 2rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 9999px;
      font-size: 0.9rem;
      color: #64748b;
    }
    #countdown {
      color: var(--secondary);
      font-weight: 700;
    }
    .success-icon {
      width: 48px;
      height: 48px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
    }
    .success-icon svg {
      width: 24px;
      height: 24px;
      color: white;
    }
  </style>
  </head>
  <body>
    <div class="background-decor">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
    <div class="card">
      <div class="logo-container">
        <img src="/logo.png" alt="Modula" class="logo">
      </div>
      <div class="success-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1>${title}</h1>
      <p>${body}</p>
      <div class="timer">
        Closing in <span id="countdown">10</span>s
      </div>
    </div>
  
  <script>
    let countdownTime = 10;
    let countdownElement = document.getElementById('countdown');
  
    function updateCountdown() {
      countdownElement.textContent = countdownTime;
      countdownTime--;
      if (countdownTime < 0) {
        window.close();
      } else {
        setTimeout(updateCountdown, 1000);
      }
    }
  
    updateCountdown();
  </script>
  </body>
  </html>`
}

