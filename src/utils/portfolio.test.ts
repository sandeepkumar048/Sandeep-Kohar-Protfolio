import test from 'node:test';
import assert from 'node:assert/strict';
import { HIGHLIGHT_ITEMS, PORTFOLIO_PROJECTS, TESTIMONIALS } from '../data/portfolioData';
import {
  filterHighlightsByCategory,
  filterProjectsByCategory,
  filterProjectsByShowcase,
  getAdjacentProjectId,
  getNextSlideIndex,
  getProjectGalleryItems,
  paginateTestimonials,
  shouldShowBackToTop,
  validateContactMessageForm,
  validateInquiryForm,
} from './portfolio';
import { removeUniformBackground } from './chromaKey';
import {
  buildResumePdfBytes,
  sanitizePdfText,
  wrapPdfText,
} from './resumePdf';
import {
  extractHashtags,
  formatPostDate,
  isSafeExternalFeedUrl,
  parseExternalFeedPayload,
  parseLinkedInRestPosts,
  parseLinkedInUgcPosts,
  sanitizeExternalHttpsUrl,
  truncatePostText,
} from './linkedinFeed';

test('filterProjectsByCategory returns all projects for All and filters Web Dev & Graphics categories', () => {
  const all = filterProjectsByCategory(PORTFOLIO_PROJECTS, 'All');
  assert.equal(all.length, 9);

  const webDev = filterProjectsByCategory(PORTFOLIO_PROJECTS, 'Web Dev');
  assert.equal(webDev.length, 2);
  assert.equal(webDev[0].id, 'biodiagnostics-path-labs');
  assert.equal(webDev[0].image, '/assets/aistudio/image_5b9c49ca.png');

  const brandIdentity = filterProjectsByCategory(PORTFOLIO_PROJECTS, 'Brand Identity');
  assert.equal(brandIdentity.length, 3);
  assert.equal(brandIdentity[0].id, 'elab-nepal-campaign');
  assert.equal(brandIdentity[0].image, '/assets/aistudio/elab_web_65653572.jpg');
  assert.equal(brandIdentity[1].id, 'syneo-labs-campaign');
  assert.equal(brandIdentity[1].image, '/assets/aistudio/every_syneo_48d331e7.png');
});

test('filterProjectsByShowcase separates Web Design and Graphics Design tracks cleanly', () => {
  const allWeb = filterProjectsByShowcase(PORTFOLIO_PROJECTS, 'web', 'All');
  assert.equal(allWeb.length, 4);
  assert.ok(allWeb.every((p) => p.showcase === 'web'));

  const fullStackWeb = filterProjectsByShowcase(PORTFOLIO_PROJECTS, 'web', 'Full-Stack');
  assert.equal(fullStackWeb.length, 2);
  assert.ok(fullStackWeb.every((p) => p.category === 'Full-Stack'));

  const allGraphics = filterProjectsByShowcase(PORTFOLIO_PROJECTS, 'graphics', 'All');
  assert.equal(allGraphics.length, 5);
  assert.ok(allGraphics.every((p) => p.showcase === 'graphics'));

  const printGraphics = filterProjectsByShowcase(PORTFOLIO_PROJECTS, 'graphics', 'Print & Visual');
  assert.equal(printGraphics.length, 2);
  assert.ok(printGraphics.every((p) => p.category === 'Print & Visual'));
});

test('getProjectGalleryItems exposes all 5 eLab Nepal designs and falls back cleanly for single-image projects', () => {
  const elab = PORTFOLIO_PROJECTS.find((p) => p.id === 'elab-nepal-campaign');
  assert.ok(elab);
  const elabItems = getProjectGalleryItems(elab);
  assert.equal(elabItems.length, 5);
  assert.deepEqual(
    elabItems.map((item) => item.src),
    [
      '/assets/aistudio/elab_web_65653572.jpg',
      '/assets/aistudio/Health_Nw_78a9623d.jpg',
      '/assets/aistudio/e-lb_c0197248.png',
      '/assets/aistudio/care_7af41d08.jpg',
      '/assets/aistudio/Ready_wherever_17fa5dbb.png',
    ]
  );

  const syneo = PORTFOLIO_PROJECTS.find((p) => p.id === 'syneo-labs-campaign');
  assert.ok(syneo);
  const syneoItems = getProjectGalleryItems(syneo);
  assert.equal(syneoItems.length, 1);
  assert.equal(syneoItems[0].src, syneo.image);
});

test('getNextSlideIndex wraps forward, backward, and guards empty carousels', () => {
  assert.equal(getNextSlideIndex(0, 4, 'next'), 1);
  assert.equal(getNextSlideIndex(3, 4, 'next'), 0);
  assert.equal(getNextSlideIndex(0, 4, 'prev'), 3);
  assert.equal(getNextSlideIndex(2, 4, 'prev'), 1);
  assert.equal(getNextSlideIndex(0, 0, 'next'), 0);
});

test('getAdjacentProjectId cycles forward and backward cleanly', () => {
  assert.equal(
    getAdjacentProjectId(PORTFOLIO_PROJECTS, 'biodiagnostics-path-labs', 'next'),
    'elab-nepal-campaign'
  );
  assert.equal(
    getAdjacentProjectId(PORTFOLIO_PROJECTS, 'biodiagnostics-path-labs', 'prev'),
    'resonance-vinyl-print'
  );
  assert.equal(
    getAdjacentProjectId(PORTFOLIO_PROJECTS, 'resonance-vinyl-print', 'next'),
    'biodiagnostics-path-labs'
  );
  assert.equal(getAdjacentProjectId([], 'any', 'next'), null);
});

test('paginateTestimonials wraps page index and slices correctly', () => {
  const page0 = paginateTestimonials(TESTIMONIALS, 0, 2);
  assert.equal(page0.totalPages, 2);
  assert.equal(page0.safePageIndex, 0);
  assert.equal(page0.items.length, 2);
  assert.equal(page0.items[0].author, 'Daniel Reed');

  const page1 = paginateTestimonials(TESTIMONIALS, 1, 2);
  assert.equal(page1.safePageIndex, 1);
  assert.equal(page1.items[0].author, 'Marcus Vance');

  const wrapped = paginateTestimonials(TESTIMONIALS, -1, 2);
  assert.equal(wrapped.safePageIndex, 1);
});

test('validateInquiryForm rejects missing or malformed fields and normalizes valid inputs', () => {
  const invalid = validateInquiryForm({
    name: 'A',
    email: 'invalid-email',
    scope: 'Web Development',
    budget: '$10k – $25k',
    message: 'Too short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateInquiryForm({
    name: '  Jordan Taylor  ',
    email: ' jordan@company.io ',
    scope: 'Graphic Design',
    budget: '$25k – $50k',
    message: '  We need a new brand identity and React marketing site this quarter.  ',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.normalized?.name, 'Jordan Taylor');
  assert.equal(valid.normalized?.email, 'jordan@company.io');
  assert.equal(
    valid.normalized?.message,
    'We need a new brand identity and React marketing site this quarter.'
  );
});

test('validateContactMessageForm enforces name, email, subject, and message fields', () => {
  const invalid = validateContactMessageForm({
    name: 'S',
    email: 'not-valid',
    subject: 'Hi',
    message: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);

  const valid = validateContactMessageForm({
    name: '  Aarav Shrestha ',
    email: ' aarav@studio.np ',
    subject: '  Website & Poster Design  ',
    message: '  Looking for a responsive landing page and event social graphics.  ',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.normalized?.name, 'Aarav Shrestha');
  assert.equal(valid.normalized?.subject, 'Website & Poster Design');
});

test('removeUniformBackground clears all 4-border pockets and decontaminates blended fringe edges', () => {
  // 24x24 synthetic portrait: solid slate bg (54,64,79), light shirt silhouette (220,230,230)
  // with an arm-torso gap touching ONLY the bottom border, plus a 50/50 blended halo ring.
  const w = 24;
  const h = 24;
  const rgba = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const inLeftArm = x >= 4 && x <= 7 && y >= 6 && y <= 23;
      const inTorso = x >= 10 && x <= 19 && y >= 6 && y <= 23;
      const inShoulder = x >= 4 && x <= 19 && y >= 4 && y <= 10;
      const isSubject = inLeftArm || inTorso || inShoulder;
      // 1px blended halo along the top of the shoulder (y === 3, x 4..19)
      const isHalo = y === 3 && x >= 4 && x <= 19;

      if (isSubject) {
        rgba[i] = 220;
        rgba[i + 1] = 230;
        rgba[i + 2] = 230;
      } else if (isHalo) {
        rgba[i] = 137;
        rgba[i + 1] = 147;
        rgba[i + 2] = 154;
      } else {
        rgba[i] = 54;
        rgba[i + 1] = 64;
        rgba[i + 2] = 79;
      }
      rgba[i + 3] = 255;
    }
  }

  const result = removeUniformBackground(rgba, w, h, {
    tolerance: 28,
    chromaTolerance: 13,
    feather: 26,
    edgeRadius: 3,
  });

  // Top-left exterior background should be fully transparent
  assert.equal(result[3], 0);
  // Bottom-connected gap between arm (x=4..7) and torso (x=10..19) at (x=8, y=18) must be fully cleared!
  assert.equal(result[(18 * w + 8) * 4 + 3], 0);
  // Deep interior torso pixel (x=14, y=14) must stay completely opaque and untouched
  assert.equal(result[(14 * w + 14) * 4 + 3], 255);
  assert.equal(result[(14 * w + 14) * 4], 220);
  // Blended halo pixel (x=12, y=3) must be decontaminated toward light shirt RGB (> 175) and soft alpha
  const haloOff = (3 * w + 12) * 4;
  assert.ok(result[haloOff] > 175, `expected decontaminated R > 175, got ${result[haloOff]}`);
  assert.ok(result[haloOff + 3] < 220, `expected feathered alpha < 220, got ${result[haloOff + 3]}`);

  // Verify neutral dark hair/temple pixel (70,68,66) adjacent to cool slate bg (54,64,79) is NOT eaten
  const hairCanvas = new Uint8ClampedArray(16 * 16 * 4);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const i = (y * 16 + x) * 4;
      const isHair = x >= 4 && x <= 11 && y >= 4 && y <= 11;
      hairCanvas[i] = isHair ? 70 : 54;
      hairCanvas[i + 1] = isHair ? 68 : 64;
      hairCanvas[i + 2] = isHair ? 66 : 79;
      hairCanvas[i + 3] = 255;
    }
  }
  const hairOut = removeUniformBackground(hairCanvas, 16, 16, {
    tolerance: 28,
    chromaTolerance: 13,
    feather: 26,
    edgeRadius: 3,
  });
  assert.equal(hairOut[3], 0);
  assert.equal(hairOut[(7 * 16 + 7) * 4 + 3], 255);
});

test('buildResumePdfBytes produces a valid PDF 1.4 document with Sandeep Kohar resume data', () => {
  assert.equal(sanitizePdfText('React · (2025) — Next.js'), 'React | \\(2025\\) - Next.js');
  assert.deepEqual(wrapPdfText('one two three four', 9), ['one two', 'three', 'four']);

  const bytes = buildResumePdfBytes();
  const pdfText = new TextDecoder().decode(bytes);
  assert.ok(pdfText.startsWith('%PDF-1.4\n'));
  assert.ok(pdfText.trimEnd().endsWith('%%EOF'));
  assert.ok(pdfText.includes('xref\n'));
  assert.ok(pdfText.includes('Sandeep Kohar'));
  assert.ok(pdfText.includes('prajapatisandeepkumar78@gmail.com'));
  assert.ok(pdfText.includes('+977 9817486282'));
  assert.ok(pdfText.includes('Syneo Labs'));
  assert.ok(pdfText.includes('eLab Nepal Pvt. Ltd.'));
  assert.ok(pdfText.includes('Bachelor of Computer Engineering'));
  assert.ok(pdfText.includes('Himalayan White House International College, Putalisadak'));
  assert.ok(bytes.byteLength > 1500);
});

test('filterHighlightsByCategory returns all highlights and separates Project, Award, and Community tracks', () => {
  assert.equal(filterHighlightsByCategory(HIGHLIGHT_ITEMS, 'All').length, HIGHLIGHT_ITEMS.length);

  const projects = filterHighlightsByCategory(HIGHLIGHT_ITEMS, 'Project');
  const awards = filterHighlightsByCategory(HIGHLIGHT_ITEMS, 'Award');
  const community = filterHighlightsByCategory(HIGHLIGHT_ITEMS, 'Community');

  assert.equal(projects.length, 3);
  assert.equal(awards.length, 3);
  assert.equal(community.length, 3);
  assert.ok(projects.every((item) => item.category === 'Project'));
  assert.ok(awards.every((item) => item.category === 'Award'));
  assert.ok(community.every((item) => item.category === 'Community'));
});

test('shouldShowBackToTop reveals button only after scrolling past the hero section', () => {
  assert.equal(shouldShowBackToTop(0, 760), false);
  assert.equal(shouldShowBackToTop(400, 760), false);
  assert.equal(shouldShowBackToTop(695, 760), false);
  assert.equal(shouldShowBackToTop(696, 760), true);
  assert.equal(shouldShowBackToTop(1400, 760), true);
  assert.equal(shouldShowBackToTop(500, 0), false);
  assert.equal(shouldShowBackToTop(600, 0), true);
});

test('LinkedIn feed URL sanitization and SSRF guard block unsafe or internal destinations', () => {
  assert.equal(
    sanitizeExternalHttpsUrl('https://www.linkedin.com/feed/update/urn:li:share:123/'),
    'https://www.linkedin.com/feed/update/urn:li:share:123/'
  );
  assert.equal(sanitizeExternalHttpsUrl('javascript:alert(1)'), undefined);
  assert.equal(sanitizeExternalHttpsUrl('data:text/html,<script>x</script>'), undefined);
  assert.equal(sanitizeExternalHttpsUrl('http://insecure.example.com'), undefined);

  assert.equal(isSafeExternalFeedUrl('https://rss.app/feeds/example.xml'), true);
  assert.equal(isSafeExternalFeedUrl('http://rss.app/feeds/example.xml'), false);
  assert.equal(isSafeExternalFeedUrl('https://127.0.0.1/feed.xml'), false);
  assert.equal(isSafeExternalFeedUrl('https://localhost/feed.xml'), false);
  assert.equal(isSafeExternalFeedUrl('https://169.254.169.254/latest/meta-data/'), false);
  assert.equal(isSafeExternalFeedUrl('https://10.0.0.5/internal'), false);
  assert.equal(isSafeExternalFeedUrl('https://192.168.1.20/feed'), false);
  assert.equal(isSafeExternalFeedUrl('https://172.16.0.10/feed'), false);
});

test('parseLinkedInRestPosts and parseLinkedInUgcPosts sort newest-first and cap to latest 3 posts', () => {
  const author = {
    name: 'Sandeep Kohar',
    headline: 'Web Developer & Graphics Designer',
    profileUrl: 'https://www.linkedin.com/in/sandeepkohar/',
  };

  const restPayload = {
    elements: [
      {
        id: 'urn:li:share:1001',
        commentary: 'Oldest post #HTML #CSS',
        createdAt: Date.UTC(2026, 7, 1),
      },
      {
        id: 'urn:li:share:1004',
        commentary: 'Newest launch for Biodiagnostics Path Labs #WebDevelopment #React #HealthcareUI',
        createdAt: Date.UTC(2026, 10, 15),
      },
      {
        id: 'urn:li:share:1002',
        commentary: 'Second post about Rotaract HWIC design workshop #Design',
        createdAt: Date.UTC(2026, 8, 20),
      },
      {
        id: 'urn:li:share:1003',
        commentary: 'Third post sharing Syneo Labs campaign #GraphicDesign',
        createdAt: Date.UTC(2026, 9, 10),
      },
    ],
  };

  const restPosts = parseLinkedInRestPosts(restPayload, author, 3);
  assert.equal(restPosts.length, 3);
  assert.equal(restPosts[0].id, 'urn:li:share:1004');
  assert.equal(restPosts[1].id, 'urn:li:share:1003');
  assert.equal(restPosts[2].id, 'urn:li:share:1002');
  assert.equal(restPosts[0].displayDate, 'Nov 15, 2026');
  assert.deepEqual(restPosts[0].hashtags, ['#WebDevelopment', '#React', '#HealthcareUI']);
  assert.equal(
    restPosts[0].postUrl,
    'https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A1004/'
  );

  const ugcPayload = {
    elements: [
      {
        id: 'urn:li:ugcPost:9001',
        created: { time: Date.UTC(2026, 9, 5) },
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: 'Legacy UGC update #Engineering' },
          },
        },
      },
    ],
  };
  const ugcPosts = parseLinkedInUgcPosts(ugcPayload, author, 3);
  assert.equal(ugcPosts.length, 1);
  assert.equal(ugcPosts[0].text, 'Legacy UGC update #Engineering');
  assert.equal(formatPostDate(Date.UTC(2026, 9, 5)), 'Oct 5, 2026');
});

test('parseExternalFeedPayload parses RSS XML and JSON feeds safely and strips HTML', () => {
  const author = {
    name: 'Sandeep Kohar',
    headline: 'Web Developer & Graphics Designer',
    profileUrl: 'https://www.linkedin.com/in/sandeepkohar/',
  };

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0"><channel>
      <item>
        <guid>p-1</guid>
        <pubDate>Tue, 10 Nov 2026 09:00:00 GMT</pubDate>
        <link>https://www.linkedin.com/posts/sandeepkohar_post-1</link>
        <description><![CDATA[<p>Built a responsive lab portal &amp; booking UI! #WebDev</p><script>bad()</script>]]></description>
      </item>
      <item>
        <guid>p-2</guid>
        <pubDate>Fri, 20 Nov 2026 12:00:00 GMT</pubDate>
        <link>javascript:alert(1)</link>
        <description>Designed Syneo Labs promotional campaign #GraphicDesign</description>
      </item>
    </channel></rss>`;

  const xmlPosts = parseExternalFeedPayload(rssXml, 'application/rss+xml', author, 3);
  assert.equal(xmlPosts.length, 2);
  assert.equal(xmlPosts[0].id, 'p-2');
  // Malicious javascript: link falls back safely to profile URL
  assert.equal(xmlPosts[0].postUrl, 'https://www.linkedin.com/in/sandeepkohar/');
  assert.ok(xmlPosts[1].text.includes('Built a responsive lab portal & booking UI!'));
  assert.equal(xmlPosts[1].text.includes('<p>'), false);

  const jsonFeed = JSON.stringify({
    items: [
      {
        id: 'j-1',
        content_text: 'Exploring TypeScript & Tailwind architecture #TypeScript #Frontend',
        date_published: '2026-11-18T10:00:00Z',
        url: 'https://www.linkedin.com/posts/sandeepkohar_ts',
        likesCount: 42,
        commentsCount: 7,
      },
    ],
  });
  const jsonPosts = parseExternalFeedPayload(jsonFeed, 'application/json', author, 3);
  assert.equal(jsonPosts.length, 1);
  assert.equal(jsonPosts[0].likesCount, 42);
  assert.equal(jsonPosts[0].commentsCount, 7);
  assert.deepEqual(extractHashtags('One #React #react #UI'), ['#React', '#UI']);

  const truncated = truncatePostText('word '.repeat(60), 40);
  assert.equal(truncated.truncated, true);
  assert.ok(truncated.excerpt.endsWith('…'));
});

