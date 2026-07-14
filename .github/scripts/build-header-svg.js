const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', '..', 'assets');

// Read Gediya Bold font and convert to base64
const fontBytes = fs.readFileSync(path.join(assetsDir, 'GediyaPersonaluse-Bold.otf'));
const fontB64 = fontBytes.toString('base64');

const svg = `<svg width="900" height="320" xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>
        @font-face {
          font-family: 'Gediya';
          src: url('data:font/otf;base64,${fontB64}') format('opentype');
          font-weight: 700;
          font-style: normal;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .hero {
          width: 900px;
          height: 320px;
          background: linear-gradient(135deg, #0a0a0f 0%, #0d1117 30%, #161b22 60%, #0a0a0f 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Animated grid lines */
        .grid {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-image:
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 8s linear infinite;
        }

        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }

        /* Floating orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: float 6s ease-in-out infinite;
        }
        .orb-1 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.15), transparent);
          top: -50px; left: 100px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(0, 170, 255, 0.12), transparent);
          bottom: -60px; right: 120px;
          animation-delay: -3s;
        }
        .orb-3 {
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(138, 43, 226, 0.1), transparent);
          top: 50px; right: 200px;
          animation-delay: -1.5s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        /* Matrix rain columns */
        .rain {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          overflow: hidden;
        }
        .drop {
          position: absolute;
          font-family: 'Courier New', monospace;
          writing-mode: vertical-rl;
          animation: matrixFall linear infinite;
          letter-spacing: 6px;
        }

        /* Layer 1: Background — slow, dim, color shift */
        .layer-bg .drop {
          font-size: 16px;
          letter-spacing: 10px;
          animation: matrixFall linear infinite, colorShiftBg 6s ease-in-out infinite;
        }
        .layer-bg .bg1  { left: 3%;  animation-duration: 14s, 6s;  animation-delay: -1s, 0s; }
        .layer-bg .bg2  { left: 18%; animation-duration: 16s, 6s;  animation-delay: -8s, -1s; }
        .layer-bg .bg3  { left: 38%; animation-duration: 13s, 6s;  animation-delay: -3s, -2s; }
        .layer-bg .bg4  { left: 55%; animation-duration: 15s, 6s;  animation-delay: -11s, -3s; }
        .layer-bg .bg5  { left: 75%; animation-duration: 17s, 6s;  animation-delay: -5s, -4s; }
        .layer-bg .bg6  { left: 92%; animation-duration: 14s, 6s;  animation-delay: -9s, -5s; }

        @keyframes colorShiftBg {
          0%, 100% { color: rgba(0, 255, 136, 0.06); }
          33%      { color: rgba(0, 170, 255, 0.06); }
          66%      { color: rgba(138, 43, 226, 0.05); }
        }

        /* Layer 2: Midground — medium speed, flicker colors */
        .layer-mid .drop {
          font-size: 13px;
          letter-spacing: 7px;
          animation: matrixFall linear infinite, colorFlicker 3s steps(1) infinite;
        }
        .layer-mid .md1  { left: 2%;  animation-duration: 8s, 3s;   animation-delay: 0s, 0s; }
        .layer-mid .md2  { left: 8%;  animation-duration: 9s, 3s;   animation-delay: -3s, -0.5s; }
        .layer-mid .md3  { left: 15%; animation-duration: 7s, 3s;   animation-delay: -6s, -1s; }
        .layer-mid .md4  { left: 24%; animation-duration: 10s, 3s;  animation-delay: -1s, -1.5s; }
        .layer-mid .md5  { left: 32%; animation-duration: 8s, 3s;   animation-delay: -5s, -2s; }
        .layer-mid .md6  { left: 42%; animation-duration: 9s, 3s;   animation-delay: -2s, -0.3s; }
        .layer-mid .md7  { left: 52%; animation-duration: 7s, 3s;   animation-delay: -7s, -0.8s; }
        .layer-mid .md8  { left: 62%; animation-duration: 11s, 3s;  animation-delay: -4s, -1.3s; }
        .layer-mid .md9  { left: 72%; animation-duration: 8s, 3s;   animation-delay: -1s, -1.8s; }
        .layer-mid .md10 { left: 82%; animation-duration: 9s, 3s;   animation-delay: -6s, -2.3s; }
        .layer-mid .md11 { left: 88%; animation-duration: 7s, 3s;   animation-delay: -3s, -0.6s; }
        .layer-mid .md12 { left: 96%; animation-duration: 10s, 3s;  animation-delay: -8s, -1.1s; }

        @keyframes colorFlicker {
          0%   { color: rgba(0, 255, 136, 0.12); }
          20%  { color: rgba(0, 230, 200, 0.15); }
          40%  { color: rgba(0, 200, 255, 0.10); }
          60%  { color: rgba(180, 255, 200, 0.18); }
          80%  { color: rgba(0, 255, 180, 0.08); }
          100% { color: rgba(0, 255, 136, 0.12); }
        }

        /* Layer 3: Foreground — fast, bright cycling heads */
        .layer-fg .drop {
          font-size: 14px;
          letter-spacing: 5px;
          animation: matrixFall linear infinite, fgGlow 2s ease-in-out infinite;
        }
        .layer-fg .fg1  { left: 6%;  animation-duration: 5s, 2s;  animation-delay: -1s, 0s; }
        .layer-fg .fg2  { left: 14%; animation-duration: 6s, 2s;  animation-delay: -4s, -0.4s; }
        .layer-fg .fg3  { left: 28%; animation-duration: 4s, 2s;  animation-delay: -2s, -0.8s; }
        .layer-fg .fg4  { left: 37%; animation-duration: 7s, 2s;  animation-delay: -5s, -1.2s; }
        .layer-fg .fg5  { left: 46%; animation-duration: 5s, 2s;  animation-delay: 0s, -1.6s; }
        .layer-fg .fg6  { left: 56%; animation-duration: 6s, 2s;  animation-delay: -3s, -0.2s; }
        .layer-fg .fg7  { left: 66%; animation-duration: 4s, 2s;  animation-delay: -6s, -0.6s; }
        .layer-fg .fg8  { left: 78%; animation-duration: 7s, 2s;  animation-delay: -1s, -1.0s; }
        .layer-fg .fg9  { left: 85%; animation-duration: 5s, 2s;  animation-delay: -4s, -1.4s; }
        .layer-fg .fg10 { left: 94%; animation-duration: 6s, 2s;  animation-delay: -2s, -1.8s; }

        @keyframes fgGlow {
          0%, 100% { color: rgba(0, 255, 136, 0.35); text-shadow: 0 0 4px rgba(0, 255, 136, 0.2); }
          25%      { color: rgba(200, 255, 230, 0.5); text-shadow: 0 0 8px rgba(0, 255, 136, 0.4); }
          50%      { color: rgba(0, 200, 255, 0.3);   text-shadow: 0 0 4px rgba(0, 170, 255, 0.2); }
          75%      { color: rgba(150, 255, 200, 0.45); text-shadow: 0 0 6px rgba(0, 255, 136, 0.3); }
        }

        @keyframes matrixFall {
          0%   { transform: translateY(-120%); opacity: 0; }
          5%   { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(420px); opacity: 0; }
        }

        /* Scan line */
        .scanline {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent);
          animation: scan 4s linear infinite;
        }
        @keyframes scan {
          0% { top: -2px; }
          100% { top: 320px; }
        }

        /* Main name — Gediya font */
        .name {
          font-family: 'Gediya', 'Segoe UI', sans-serif;
          font-size: 58px;
          font-weight: 700;
          letter-spacing: 6px;
          position: relative;
          z-index: 10;
          background: linear-gradient(135deg, #00ff88, #00aaff, #8a2be2, #00ff88);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease infinite;
          text-shadow: none;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Glow behind name */
        .name-glow {
          position: absolute;
          font-family: 'Gediya', 'Segoe UI', sans-serif;
          font-size: 58px;
          font-weight: 700;
          letter-spacing: 6px;
          color: transparent;
          z-index: 9;
          text-shadow: 0 0 40px rgba(0, 255, 136, 0.3), 0 0 80px rgba(0, 170, 255, 0.15);
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Subtitle */
        .subtitle {
          font-size: 16px;
          color: rgba(200, 220, 255, 0.6);
          letter-spacing: 6px;
          text-transform: uppercase;
          margin-top: 12px;
          z-index: 10;
          position: relative;
          animation: fadeSlideUp 2s ease forwards;
        }

        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Terminal cursor blink */
        .cursor {
          color: #00ff88;
          font-weight: bold;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Status line */
        .status {
          margin-top: 20px;
          display: flex;
          gap: 24px;
          z-index: 10;
          position: relative;
        }
        .status-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(200, 220, 255, 0.4);
          letter-spacing: 1px;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: dotPulse 2s ease-in-out infinite;
        }
        .dot-green { background: #00ff88; box-shadow: 0 0 6px #00ff88; }
        .dot-blue { background: #00aaff; box-shadow: 0 0 6px #00aaff; animation-delay: 0.5s; }
        .dot-purple { background: #8a2be2; box-shadow: 0 0 6px #8a2be2; animation-delay: 1s; }

        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.5); opacity: 1; }
        }

        /* Bottom border glow */
        .border-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ff88, #00aaff, #8a2be2, transparent);
          animation: borderFlow 3s linear infinite;
          background-size: 200% 100%;
        }

        @keyframes borderFlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      </style>

      <div class="hero">
        <div class="grid"></div>

        <div class="rain">
          <!-- Background layer: slow, dim, large -->
          <div class="layer-bg">
            <span class="drop bg1">4F0A7E3B9D</span>
            <span class="drop bg2">1C8D5F2A6E</span>
            <span class="drop bg3">B3E17C0F9A</span>
            <span class="drop bg4">6A2D8B4F1C</span>
            <span class="drop bg5">0E9C3A7D5B</span>
            <span class="drop bg6">D7F2B80E4A</span>
          </div>

          <!-- Midground layer: medium speed -->
          <div class="layer-mid">
            <span class="drop md1">0xF3A71D</span>
            <span class="drop md2">10110100</span>
            <span class="drop md3">0xC8E42B</span>
            <span class="drop md4">01101011</span>
            <span class="drop md5">0x9AF05E</span>
            <span class="drop md6">11010010</span>
            <span class="drop md7">0x7B3D16</span>
            <span class="drop md8">01001110</span>
            <span class="drop md9">0xE6521A</span>
            <span class="drop md10">10011101</span>
            <span class="drop md11">0x4FD893</span>
            <span class="drop md12">01110010</span>
          </div>

          <!-- Foreground layer: fast, bright gradient heads -->
          <div class="layer-fg">
            <span class="drop fg1">F7A30E9B5D</span>
            <span class="drop fg2">2C0xDE4BA1</span>
            <span class="drop fg3">C90x1F3E7B</span>
            <span class="drop fg4">5A0x8B2D6F</span>
            <span class="drop fg5">0x3FD71C9E</span>
            <span class="drop fg6">6E0xA4B30F</span>
            <span class="drop fg7">B20x9C7E1A</span>
            <span class="drop fg8">0xF18D3C5A</span>
            <span class="drop fg9">4A00xE6B72</span>
            <span class="drop fg10">0x5B3FC8D1</span>
          </div>
        </div>

        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>

        <div class="scanline"></div>

        <span class="name-glow">Abu Dzakiyyah</span>
        <span class="name">Abu Dzakiyyah</span>

        <div class="subtitle">
          Software Engineer &#x2022; Ruqyah Practitioner<span class="cursor">_</span>
        </div>

        <div class="status">
          <div class="status-item">
            <span class="dot dot-green"></span>
            AVAILABLE FOR HIRE
          </div>
          <div class="status-item">
            <span class="dot dot-blue"></span>
            BUILDING COOL STUFF
          </div>
          <div class="status-item">
            <span class="dot dot-purple"></span>
            OPEN SOURCE
          </div>
        </div>

        <div class="border-glow"></div>
      </div>
    </div>
  </foreignObject>
</svg>`;

const outPath = path.join(assetsDir, 'header.svg');
fs.writeFileSync(outPath, svg, 'utf8');
const size = fs.statSync(outPath).size;
console.log('✅ header.svg generated with Gediya font embedded (' + (size / 1024).toFixed(1) + ' KB)');
