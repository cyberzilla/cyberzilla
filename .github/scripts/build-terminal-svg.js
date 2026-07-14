const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', '..', 'assets');
const fontBytes = fs.readFileSync(path.join(assetsDir, 'maple-mono-400.woff2'));
const b64 = fontBytes.toString('base64');

const svg = `<svg width="900" height="310" xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>
        @font-face {
          font-family: 'Maple Mono';
          src: url('data:font/woff2;base64,${b64}') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .terminal {
          width: 900px;
          height: 310px;
          background: #0d1117;
          border: 1px solid rgba(0, 255, 136, 0.15);
          border-radius: 12px;
          padding: 0;
          font-family: 'Maple Mono', 'Courier New', monospace;
          position: relative;
          overflow: hidden;
        }
        .terminal-bar {
          height: 32px;
          background: linear-gradient(180deg, #1a1f2e, #141821);
          border-bottom: 1px solid rgba(0, 255, 136, 0.1);
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 8px;
        }
        .terminal-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .td-red { background: #ff5f57; }
        .td-yellow { background: #ffbd2e; }
        .td-green { background: #28c840; }
        .terminal-title {
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: rgba(200, 220, 255, 0.4);
          letter-spacing: 1px;
        }
        .terminal-body {
          padding: 14px 20px;
        }
        .line {
          font-size: 13px;
          line-height: 1.7;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .prompt { color: #00ff88; }
        .cmd { color: #00aaff; }
        .flag { color: #8a2be2; }
        .val { color: #e2e8f0; }
        .comment { color: rgba(200, 220, 255, 0.25); font-style: italic; }
        .str { color: #fbbf24; }
        .err { color: #ff6b6b; }
        .success { color: #00ff88; }
        .dim { color: rgba(200, 220, 255, 0.35); }
        .highlight { color: #ff79c6; font-weight: bold; }

        .line { opacity: 0; animation: lineAppear 0.5s ease forwards; }
        .l1 { animation-delay: 0.2s; }
        .l2 { animation-delay: 0.5s; }
        .l3 { animation-delay: 0.9s; }
        .l4 { animation-delay: 1.2s; }
        .l5 { animation-delay: 1.6s; }
        .l6 { animation-delay: 1.9s; }
        .l7 { animation-delay: 2.3s; }
        .l8 { animation-delay: 2.6s; }
        .l9 { animation-delay: 3.0s; }
        .l10 { animation-delay: 3.3s; }
        .l11 { animation-delay: 3.7s; }

        @keyframes lineAppear {
          0% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        .cursor-block {
          color: #00ff88;
          animation: blinkCursor 1s step-end infinite;
          font-weight: bold;
        }
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .terminal::before {
          content: '';
          position: absolute;
          top: -1px; left: -1px;
          right: -1px; bottom: -1px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(0,255,136,0.1), transparent, rgba(0,170,255,0.1));
          z-index: -1;
        }

        .separator {
          height: 1px;
          background: linear-gradient(90deg, rgba(0,255,136,0.15), transparent);
          margin: 6px 0;
          opacity: 0;
          animation: lineAppear 0.5s ease forwards;
        }

        .tag {
          display: inline-block;
          font-size: 10px;
          padding: 1px 6px;
          border-radius: 3px;
          letter-spacing: 0.5px;
          font-weight: bold;
        }
        .tag-rare { color: #ff79c6; background: rgba(255,121,198,0.1); border: 1px solid rgba(255,121,198,0.2); }
        .tag-zero { color: #00ff88; background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2); }
        .tag-soul { color: #fbbf24; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2); }
      </style>

      <div class="terminal">
        <div class="terminal-bar">
          <span class="terminal-dot td-red"></span>
          <span class="terminal-dot td-yellow"></span>
          <span class="terminal-dot td-green"></span>
          <span class="terminal-title">abu@cyberzilla ~ /about-me</span>
        </div>
        <div class="terminal-body">

          <div class="line l1">
            <span class="prompt">&#x276F;</span>
            <span class="cmd">whoami</span>
            <span class="flag">--verbose</span>
          </div>
          <div class="line l2">
            <span class="val">Abu Dzakiyyah &#x2014; Software Engineer from Indonesia &#x1F1EE;&#x1F1E9;</span>
          </div>
          <div class="line l3">
            <span class="val">Who still writes <span class="highlight">Visual Basic 6.0</span> in 2026 and is proud of it.</span>
            <span class="tag tag-rare">RARE BREED</span>
          </div>

          <div class="separator l4" style="animation-delay: 1.2s;"></div>

          <div class="line l5">
            <span class="prompt">&#x276F;</span>
            <span class="cmd">cat</span>
            <span class="str">/etc/philosophy.conf</span>
          </div>
          <div class="line l6">
            <span class="success">ZERO_DEPS</span><span class="dim">=true</span>
            <span class="comment"># no framework, no problem</span>
            <span class="tag tag-zero">FROM SCRATCH</span>
          </div>
          <div class="line l7">
            <span class="success">BRIDGE</span><span class="dim">=</span><span class="str">"old_school &#x2194; modern"</span>
            <span class="comment"># VB6 meets WebView2, TLS, WebSocket</span>
          </div>
          <div class="line l8">
            <span class="success">BUILDS</span><span class="dim">=</span><span class="str">"tools, not just apps"</span>
            <span class="comment"># editors, sockets, simulators</span>
          </div>

          <div class="separator l9" style="animation-delay: 3.0s;"></div>

          <div class="line l10">
            <span class="prompt">&#x276F;</span>
            <span class="cmd">echo</span>
            <span class="str">"By day I engineer software, by calling I heal souls &#x2728;"</span>
            <span class="tag tag-soul">RUQYAH</span>
          </div>

          <div class="line l11">
            <span class="prompt">&#x276F;</span>
            <span class="cursor-block">_</span>
          </div>

        </div>
      </div>
    </div>
  </foreignObject>
</svg>`;

const outPath = path.join(assetsDir, 'about-terminal.svg');
fs.writeFileSync(outPath, svg, 'utf8');
const size = fs.statSync(outPath).size;
console.log('✅ about-terminal.svg generated with Maple Mono embedded (' + (size / 1024).toFixed(1) + ' KB)');
