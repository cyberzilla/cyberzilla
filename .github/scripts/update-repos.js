const https = require('https');
const fs = require('fs');
const path = require('path');

const USERNAME = 'cyberzilla';
const REPO_COUNT = 4;
const ROOT_DIR = path.join(__dirname, '..', '..');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const STATS_DIR = path.join(ASSETS_DIR, 'stats');
const README_PATH = path.join(ROOT_DIR, 'README.md');

const COLORS = [
  { accent: '#00ff88', accentDark: '#00cc6a', name: 'green' },
  { accent: '#00aaff', accentDark: '#0077cc', name: 'blue' },
  { accent: '#8a2be2', accentDark: '#6b1fb8', name: 'purple' },
  { accent: '#fbbf24', accentDark: '#d4a017', name: 'gold' },
];

const LANG_COLORS = {
  'JavaScript': '#f1e05a', 'TypeScript': '#3178c6', 'Python': '#3572A5',
  'PHP': '#4F5D95', 'HTML': '#e34c26', 'CSS': '#563d7c',
  'Visual Basic 6.0': '#945db7', 'Java': '#b07219', 'C#': '#178600',
  'C++': '#f34b7d', 'C': '#555555', 'Go': '#00ADD8', 'Rust': '#dea584',
  'Ruby': '#701516', 'Shell': '#89e051', 'PowerShell': '#012456',
  'Dart': '#00B4AB', 'Kotlin': '#A97BFF', 'Swift': '#F05138',
};

// ═══════════════════════════════════════════════════════════════
// STATS SVG URLs — the external APIs to cache locally
// ═══════════════════════════════════════════════════════════════

const STATS_URLS = {
  'github-stats.svg': `https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=true&theme=github_dark&bg_color=0d1117&hide_border=true&icon_color=00ff88&title_color=00ff88&text_color=c9d1d9&ring_color=00ff88`,
  'top-langs.svg': `https://github-readme-stats.vercel.app/api/top-langs/?username=${USERNAME}&theme=github_dark&bg_color=0d1117&hide_border=true&title_color=00ff88&text_color=c9d1d9&layout=compact&langs_count=8`,
  'streak-stats.svg': `https://github-readme-streak-stats.herokuapp.com?user=${USERNAME}&theme=dark&hide_border=true&background=0D1117&stroke=00ff8822&ring=00ff88&fire=00aaff&currStreakNum=e2e8f0&sideNums=e2e8f0&currStreakLabel=00ff88&sideLabels=c9d1d9&dates=555555`,
  'contribution-graph.svg': `https://github-readme-activity-graph.vercel.app/graph?username=${USERNAME}&bg_color=0d1117&color=00ff88&line=00aaff&point=8a2be2&area_color=00ff8815&area=true&hide_border=true&custom_title=Contribution%20Timeline`,
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'github-profile-updater',
        'Accept': 'application/vnd.github.v3+json',
      },
    };
    if (process.env.GITHUB_TOKEN) {
      options.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function downloadFile(url, destPath, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));

    const proto = url.startsWith('https') ? https : require('http');
    proto.get(url, { headers: { 'User-Agent': 'github-profile-updater' } }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath, maxRedirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => { fileStream.close(); resolve(); });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function isRecent(dateStr, daysThreshold = 14) {
  return (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24) <= daysThreshold;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function replaceSection(content, startMarker, endMarker, newInner) {
  const regex = new RegExp(
    `${startMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
    'g'
  );
  if (content.includes(startMarker) && content.includes(endMarker)) {
    return { content: content.replace(regex, `${startMarker}\n${newInner}\n${endMarker}`), replaced: true };
  }
  return { content, replaced: false };
}

// ═══════════════════════════════════════════════════════════════
// REPO SVG GENERATOR
// ═══════════════════════════════════════════════════════════════

function generateRepoCard(repo, index) {
  const color = COLORS[index % COLORS.length];
  const langColor = LANG_COLORS[repo.language] || '#8b949e';
  const langName = repo.language || 'Unknown';
  const desc = escapeXml(repo.description || 'No description provided');
  const truncDesc = desc.length > 100 ? desc.substring(0, 97) + '...' : desc;
  const date = formatDate(repo.created_at);
  const recent = isRecent(repo.created_at);

  const badgeHtml = recent
    ? `<span class="badge-new" style="color: ${color.accent}; background: ${color.accent}15; border: 1px solid ${color.accent}33;">NEW</span>`
    : '';

  return `
          <!-- ${repo.name} -->
          <div class="repo-card r${index + 1}">
            <div class="repo-header">
              <span class="repo-icon">&#x1F4D6;</span>
              <span class="repo-name">${escapeXml(repo.name)}</span>
              ${badgeHtml}
            </div>
            <div class="repo-desc">${truncDesc}</div>
            <div class="repo-footer">
              <div class="repo-meta">
                <span class="meta-item"><span class="lang-dot" style="background: ${langColor};"></span> ${escapeXml(langName)}</span>
                <span class="meta-item">&#x2B50; ${repo.stargazers_count}</span>
                <span class="meta-item">&#x1F374; ${repo.forks_count}</span>
                ${repo.license ? `<span class="meta-item">&#x1F4DC; ${escapeXml(repo.license.spdx_id)}</span>` : ''}
              </div>
              <span class="repo-date">${date}</span>
            </div>
          </div>`;
}

function generateRepoSvg(repos) {
  const cards = repos.map((repo, i) => generateRepoCard(repo, i)).join('\n');
  const rows = Math.ceil(repos.length / 2);
  const height = 50 + rows * 160 + 16;

  return `<svg width="900" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .wrapper { width: 900px; height: ${height}px; padding: 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 4px; color: rgba(200, 220, 255, 0.35); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(0,255,136,0.2), transparent); }
        .repos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .repo-card { background: linear-gradient(135deg, rgba(13,17,23,0.95), rgba(22,27,34,0.95)); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 18px 20px; position: relative; overflow: hidden; opacity: 0; animation: cardReveal 0.6s ease forwards; }
        .repo-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; border-radius: 12px 12px 0 0; }
        .r1 { animation-delay: 0.1s; } .r1::before { background: linear-gradient(90deg, ${COLORS[0].accent}, ${COLORS[0].accentDark}); } .r1 { box-shadow: 0 4px 24px ${COLORS[0].accent}08; }
        .r2 { animation-delay: 0.2s; } .r2::before { background: linear-gradient(90deg, ${COLORS[1].accent}, ${COLORS[1].accentDark}); } .r2 { box-shadow: 0 4px 24px ${COLORS[1].accent}08; }
        .r3 { animation-delay: 0.3s; } .r3::before { background: linear-gradient(90deg, ${COLORS[2].accent}, ${COLORS[2].accentDark}); } .r3 { box-shadow: 0 4px 24px ${COLORS[2].accent}08; }
        .r4 { animation-delay: 0.4s; } .r4::before { background: linear-gradient(90deg, ${COLORS[3].accent}, ${COLORS[3].accentDark}); } .r4 { box-shadow: 0 4px 24px ${COLORS[3].accent}08; }
        @keyframes cardReveal { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
        .repo-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .repo-icon { font-size: 16px; } .repo-name { font-size: 15px; font-weight: 700; color: #58a6ff; letter-spacing: 0.3px; }
        .repo-desc { font-size: 12px; color: rgba(200, 220, 255, 0.45); line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .repo-meta { display: flex; align-items: center; gap: 14px; font-size: 11px; color: rgba(200, 220, 255, 0.3); }
        .meta-item { display: flex; align-items: center; gap: 4px; }
        .lang-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .repo-date { font-size: 10px; color: rgba(200,220,255,0.2); letter-spacing: 1px; text-transform: uppercase; }
        .repo-footer { display: flex; align-items: center; justify-content: space-between; }
        .badge-new { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; margin-left: auto; animation: badgePulse 2s ease-in-out infinite; }
        @keyframes badgePulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
      </style>
      <div class="wrapper">
        <div class="section-title">&#x1F4E6; Latest Created Repositories</div>
        <div class="repos-grid">
${cards}
        </div>
      </div>
    </div>
  </foreignObject>
</svg>`;
}

function generatePinCards(repos) {
  const rows = [];
  for (let i = 0; i < repos.length; i += 2) {
    const color = COLORS[i % COLORS.length];
    const color2 = COLORS[(i + 1) % COLORS.length];
    let row = '  <tr>\n';
    row += `    <td>\n      <a href="${repos[i].html_url}">\n        <img src="https://github-readme-stats.vercel.app/api/pin/?username=${USERNAME}&repo=${repos[i].name}&bg_color=0d1117&title_color=${color.accent.slice(1)}&icon_color=${color.accent.slice(1)}&text_color=c9d1d9&border_color=1a1f2e&hide_border=false" alt="${repos[i].name}"/>\n      </a>\n    </td>\n`;
    if (repos[i + 1]) {
      row += `    <td>\n      <a href="${repos[i + 1].html_url}">\n        <img src="https://github-readme-stats.vercel.app/api/pin/?username=${USERNAME}&repo=${repos[i + 1].name}&bg_color=0d1117&title_color=${color2.accent.slice(1)}&icon_color=${color2.accent.slice(1)}&text_color=c9d1d9&border_color=1a1f2e&hide_border=false" alt="${repos[i + 1].name}"/>\n      </a>\n    </td>\n`;
    }
    row += '  </tr>';
    rows.push(row);
  }
  return `<table>\n${rows.join('\n')}\n</table>`;
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  ensureDir(STATS_DIR);

  // ─── STEP 1: Download & cache all GitHub Stats SVGs ───
  console.log('\n📊 Downloading GitHub Stats SVGs...');
  for (const [filename, url] of Object.entries(STATS_URLS)) {
    const destPath = path.join(STATS_DIR, filename);
    try {
      await downloadFile(url, destPath);
      const size = fs.statSync(destPath).size;
      console.log(`   ✅ ${filename} (${(size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.log(`   ⚠️  ${filename} — failed: ${err.message} (keeping previous version if exists)`);
    }
  }

  // ─── STEP 2: Fetch latest repos & generate SVG ───
  console.log(`\n📦 Fetching latest repos for ${USERNAME}...`);
  const allRepos = await fetchJson(
    `https://api.github.com/users/${USERNAME}/repos?sort=created&direction=desc&per_page=20`
  );

  if (!Array.isArray(allRepos)) {
    console.error('❌ Failed to fetch repos:', allRepos);
    process.exit(1);
  }

  const repos = allRepos.filter((r) => !r.fork).slice(0, REPO_COUNT);
  console.log(`   ✅ Found ${repos.length} repos:`);
  repos.forEach((r, i) => console.log(`      ${i + 1}. ${r.name} (${r.language || 'N/A'}) — ${formatDate(r.created_at)}`));

  // Generate repo overview SVG
  const repoSvg = generateRepoSvg(repos);
  const repoSvgPath = path.join(ASSETS_DIR, 'tech-stack.svg');
  fs.writeFileSync(repoSvgPath, repoSvg, 'utf8');
  console.log(`   ✅ Repo SVG updated`);

  // ─── STEP 3: Update README markers ───
  console.log('\n📝 Updating README.md...');
  let readme = fs.readFileSync(README_PATH, 'utf8');

  // Update pin cards
  const pinCards = generatePinCards(repos);
  const r1 = replaceSection(readme, '<!-- LATEST-REPOS:START -->', '<!-- LATEST-REPOS:END -->', pinCards);
  readme = r1.content;
  console.log(`   ${r1.replaced ? '✅' : '⚠️ '} LATEST-REPOS section ${r1.replaced ? 'updated' : 'markers not found'}`);

  fs.writeFileSync(README_PATH, readme, 'utf8');
  console.log('   ✅ README saved');

  console.log('\n🎉 All done! Profile is up to date.\n');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
