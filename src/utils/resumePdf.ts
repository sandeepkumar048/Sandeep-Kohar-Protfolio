import {
  CAREER_HISTORY,
  EDUCATION_HISTORY,
  PERSONAL_PROFILE,
  SKILL_GROUPS,
  type CareerEntry,
  type EducationEntry,
  type SkillGroup,
} from '../data/portfolioData';

export interface ResumeDocumentData {
  name: string;
  title: string;
  email: string;
  phone: string;
  currentLocation: string;
  hometown: string;
  summary: string;
  certifications: string[];
  skillGroups: SkillGroup[];
  education: EducationEntry[];
  experience: CareerEntry[];
}

export const DEFAULT_RESUME_DATA: ResumeDocumentData = {
  name: PERSONAL_PROFILE.name,
  title: PERSONAL_PROFILE.title,
  email: PERSONAL_PROFILE.email,
  phone: PERSONAL_PROFILE.phone,
  currentLocation: PERSONAL_PROFILE.currentLocation,
  hometown: PERSONAL_PROFILE.hometown,
  summary: PERSONAL_PROFILE.aboutBio,
  certifications: PERSONAL_PROFILE.certifications,
  skillGroups: SKILL_GROUPS,
  education: EDUCATION_HISTORY,
  experience: CAREER_HISTORY,
};

/**
 * Normalizes Unicode punctuation to Base-14 WinAnsi-safe ASCII and escapes PDF string literals.
 */
export function sanitizePdfText(input: string): string {
  const normalized = input
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2192/g, '->')
    .replace(/\u00B7/g, '|')
    .replace(/\u2026/g, '...')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Wraps plain text into lines bounded by maxChars characters.
 */
export function wrapPdfText(input: string, maxChars: number): string[] {
  const words = input.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const candidate = `${current} ${words[i]}`;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

/**
 * Generates a valid, standards-compliant single-page PDF 1.4 binary for Sandeep Kohar's resume.
 */
export function buildResumePdfBytes(
  data: ResumeDocumentData = DEFAULT_RESUME_DATA
): Uint8Array<ArrayBuffer> {
  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 44;
  const contentWidth = pageWidth - marginX * 2;

  const ops: string[] = [];

  // Electric acid-lime accent bar across the top edge (#B7F83C)
  ops.push('0.718 0.973 0.235 rg');
  ops.push(`0 ${pageHeight - 9} ${pageWidth} 9 re f`);

  let y = pageHeight - 40;

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    font: 'F1' | 'F2' | 'F3',
    size: number,
    rgb: [number, number, number] = [0.067, 0.067, 0.067]
  ) => {
    ops.push(`${rgb[0]} ${rgb[1]} ${rgb[2]} rg`);
    ops.push(`BT /${font} ${size} Tf 1 0 0 1 ${x} ${yPos} Tm (${sanitizePdfText(text)}) Tj ET`);
  };

  const drawDivider = (yPos: number) => {
    ops.push('0.86 0.86 0.86 RG 0.6 w');
    ops.push(`${marginX} ${yPos} m ${marginX + contentWidth} ${yPos} l S`);
  };

  // Header block
  drawText(data.name, marginX, y, 'F2', 22, [0.067, 0.067, 0.067]);
  y -= 17;
  drawText(data.title, marginX, y, 'F3', 12, [0.32, 0.32, 0.32]);

  // Right-aligned contact metadata
  drawText(`${data.phone}  |  ${data.email}`, marginX + 245, y + 16, 'F1', 8.5, [0.22, 0.22, 0.22]);
  drawText(
    `${data.currentLocation}  |  ${data.hometown}`,
    marginX + 245,
    y + 3,
    'F1',
    8.5,
    [0.42, 0.42, 0.42]
  );

  y -= 12;
  drawDivider(y);
  y -= 16;

  // About Me section
  drawText('ABOUT ME', marginX, y, 'F2', 9.5, [0.067, 0.067, 0.067]);
  y -= 13;
  for (const line of wrapPdfText(data.summary, 102)) {
    drawText(line, marginX, y, 'F1', 9, [0.22, 0.22, 0.22]);
    y -= 12;
  }

  y -= 4;
  drawDivider(y);
  y -= 16;

  // Experience section
  drawText('EXPERIENCE', marginX, y, 'F2', 9.5, [0.067, 0.067, 0.067]);
  y -= 14;

  for (const role of data.experience) {
    drawText(role.role, marginX, y, 'F2', 9.5, [0.067, 0.067, 0.067]);
    drawText(role.company, marginX + 190, y, 'F1', 9, [0.38, 0.38, 0.38]);
    drawText(
      `${role.periodStart} - ${role.periodEnd}`,
      pageWidth - marginX - 102,
      y,
      'F2',
      8.5,
      [0.18, 0.18, 0.18]
    );
    y -= 12;

    const maxBullets = data.experience.length >= 5 ? 2 : 3;
    const bullets = role.highlights.slice(0, maxBullets);
    for (const bullet of bullets) {
      const wrapped = wrapPdfText(`- ${bullet}`, 102);
      for (const line of wrapped) {
        drawText(line, marginX + 6, y, 'F1', 8.5, [0.28, 0.28, 0.28]);
        y -= 10.5;
      }
    }
    y -= 5;
  }

  drawDivider(y + 1);
  y -= 15;

  // Education & Certifications
  drawText('EDUCATION', marginX, y, 'F2', 9.5, [0.067, 0.067, 0.067]);
  drawText('CERTIFICATIONS', marginX + 340, y, 'F2', 9.5, [0.067, 0.067, 0.067]);
  y -= 14;

  const eduStartY = y;
  for (const edu of data.education) {
    drawText(`${edu.degree} - ${edu.institution}`, marginX, y, 'F2', 8.8, [0.12, 0.12, 0.12]);
    y -= 11;
    drawText(edu.period, marginX, y, 'F1', 8.3, [0.42, 0.42, 0.42]);
    y -= 13;
  }

  let certY = eduStartY;
  for (const cert of data.certifications) {
    drawText(`- ${cert}`, marginX + 340, certY, 'F1', 9, [0.22, 0.22, 0.22]);
    certY -= 13;
  }

  y = Math.min(y, certY) - 4;
  drawDivider(y + 2);
  y -= 14;

  // Skills section
  drawText('SKILLS', marginX, y, 'F2', 9.5, [0.067, 0.067, 0.067]);
  y -= 13;

  for (const group of data.skillGroups) {
    if (y < 48) break;
    const lineText = `${group.label}: ${group.items.join(' | ')}`;
    for (const line of wrapPdfText(lineText, 102)) {
      drawText(line, marginX, y, 'F1', 8.6, [0.25, 0.25, 0.25]);
      y -= 11;
    }
  }

  // Footer note
  drawDivider(36);
  drawText(
    `${data.name}  |  ${data.phone}  |  ${data.email}  |  ${PERSONAL_PROFILE.linkedinLabel}`,
    marginX,
    22,
    'F1',
    8,
    [0.45, 0.45, 0.45]
  );

  const streamContent = `${ops.join('\n')}\n`;
  const encoder = new TextEncoder();
  const streamByteLength = encoder.encode(streamContent).length;

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj\n`,
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>\nendobj\n',
    `7 0 obj\n<< /Length ${streamByteLength} >>\nstream\n${streamContent}endstream\nendobj\n`,
  ];

  const header = '%PDF-1.4\n';
  const parts: string[] = [header];
  const offsets: number[] = [0];
  let currentOffset = encoder.encode(header).length;

  for (const obj of objects) {
    offsets.push(currentOffset);
    parts.push(obj);
    currentOffset += encoder.encode(obj).length;
  }

  const xrefOffset = currentOffset;
  const xrefLines = [`xref\n0 ${objects.length + 1}\n`, '0000000000 65535 f \n'];
  for (let i = 1; i <= objects.length; i++) {
    xrefLines.push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  const fullPdf = parts.join('') + xrefLines.join('') + trailer;

  const encoded = encoder.encode(fullPdf);
  const buffer = new ArrayBuffer(encoded.byteLength);
  const bytes = new Uint8Array(buffer);
  bytes.set(encoded);
  return bytes;
}

/**
 * Triggers a browser file download of Sandeep Kohar's portfolio/resume PDF.
 */
export function downloadResumePdf(
  filename = 'Sandeep_Kohar_Resume.pdf',
  data: ResumeDocumentData = DEFAULT_RESUME_DATA
): void {
  const bytes = buildResumePdfBytes(data);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);
}
