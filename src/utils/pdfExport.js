import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { screenDefinitions } from '../data/mockData';

// ── Design tokens mirroring the UI ──────────────────────────────────────────
const C = {
  bg:        [15,  17,  23],
  card:      [30,  34,  48],
  accent:    [245, 158, 11],
  accentPale:[253, 246, 226],
  textPri:   [232, 234, 237],
  textSec:   [156, 163, 180],
  textMuted: [107, 114, 128],
  border:    [45,  51,  72],
  success:   [34,  197, 94],
  info:      [59,  130, 246],
  critical:  [239, 68,  68],
  white:     [255, 255, 255],
  black:     [0,   0,   0],
  pageBg:    [250, 250, 252],
  msgBg:     [253, 247, 232],
};

function rgb(arr)  { return arr; }
function hex(h)    { const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16); return [r,g,b]; }

function stripInline(text) {
  return (text || '')
    .replace(/<strong>(.*?)<\/strong>/g, '$1')
    .replace(/<em>(.*?)<\/em>/g, '$1')
    .replace(/<code[^>]*>(.*?)<\/code>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

// Parse raw markdown into structured blocks
function parseBlocks(text) {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks = [];
  let i = 0;
  const SEP = /^\|[\s\-:|]+\|$/;

  while (i < lines.length) {
    const line = lines[i];
    const tr = line.trim();

    // table block
    if (tr.startsWith('|') && tr.endsWith('|')) {
      const tbl = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) tbl.push(lines[i++]);
      const rows = tbl.filter(l => !SEP.test(l.trim()));
      if (rows.length) {
        const parse = r => r.split('|').slice(1,-1).map(c => stripInline(c.trim()));
        blocks.push({ type:'table', header: parse(rows[0]), rows: rows.slice(1).map(parse) });
      }
      continue;
    }
    // heading
    const hm = line.match(/^(#{1,3})\s+(.*)/);
    if (hm) { blocks.push({ type:'heading', level: hm[1].length, text: stripInline(hm[2]) }); i++; continue; }
    // unordered list
    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) items.push(stripInline(lines[i++].replace(/^[-*]\s/, '')));
      blocks.push({ type:'list', items }); continue;
    }
    // ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) items.push(stripInline(lines[i++].replace(/^\d+\.\s/, '')));
      blocks.push({ type:'olist', items }); continue;
    }
    // empty
    if (!tr) { i++; continue; }
    // paragraph
    blocks.push({ type:'para', text: stripInline(line) }); i++;
  }
  return blocks;
}

// Estimate rendered height (in mm) for a set of blocks
function estimateBlocksHeight(pdf, blocks, contentW) {
  let h = 0;
  for (const b of blocks) {
    if (b.type === 'heading')  h += 8;
    else if (b.type === 'para')  h += pdf.splitTextToSize(b.text || '', contentW - 12).length * 4.6 + 2;
    else if (b.type === 'list')  h += b.items.reduce((s, item) => s + pdf.splitTextToSize(item, contentW - 22).length * 4.6 + 1, 0) + 2;
    else if (b.type === 'olist') h += b.items.reduce((s, item) => s + pdf.splitTextToSize(item, contentW - 22).length * 4.6 + 1, 0) + 2;
    else if (b.type === 'table') h += (b.rows.length + 1) * 7 + 6;
  }
  return h + 10; // inner padding
}

async function captureEl(selector, bg = '#ffffff') {
  const el = document.querySelector(selector);
  if (!el) return null;
  try {
    const canvas = await html2canvas(el, { backgroundColor: bg, scale: 2, logging: false, useCORS: true });
    return { dataUrl: canvas.toDataURL('image/png'), w: canvas.width, h: canvas.height };
  } catch { return null; }
}

export async function generatePDF(chatHistory, currentScreenId) {
  const pdf  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW   = pdf.internal.pageSize.getWidth();
  const PH   = pdf.internal.pageSize.getHeight();
  const M    = 15;
  const CW   = PW - M * 2;
  const dateStr = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  let y = 0;

  // ── HEADER ────────────────────────────────────────────────────────────────
  // Amber top accent line
  pdf.setFillColor(...C.accent);
  pdf.rect(0, 0, PW, 2, 'F');

  // Dark header bar
  pdf.setFillColor(...C.bg);
  pdf.rect(0, 2, PW, 32, 'F');

  // Logo
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(...C.white);
  const claryW = pdf.getTextWidth('CLARY');
  pdf.text('CLARY', M, 20);
  pdf.setTextColor(...C.accent);
  pdf.text('NT', M + claryW, 20);

  // Subheading under logo
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(...C.textMuted);
  pdf.text('GROWTH COMMAND CENTRE', M, 26);

  // Screen name (right)
  const screenName = screenDefinitions[currentScreenId]?.name || 'Command Centre';
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(...C.accent);
  pdf.text(screenName, PW - M, 18, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(...C.textSec);
  pdf.text(`North-2 · RSM · ${dateStr}`, PW - M, 25, { align: 'right' });

  y = 42;

  // ── SCREEN SNAPSHOT ────────────────────────────────────────────────────────
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const snapBg = isDark ? '#0f1117' : '#f4f5f7';
  const snap = await captureEl('.screen', snapBg);
  if (snap) {
    // Section label
    pdf.setFillColor(...C.accent);
    pdf.rect(M, y, 2, 5, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(50, 50, 50);
    pdf.text('SCREEN SNAPSHOT', M + 5, y + 3.6);
    y += 9;

    const imgH = Math.min((snap.h / snap.w) * CW, 120);
    // subtle border around image
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.3);
    pdf.rect(M, y, CW, imgH, 'S');
    pdf.addImage(snap.dataUrl, 'PNG', M, y, CW, imgH);
    y += imgH + 10;
  }

  // ── CHARTS ─────────────────────────────────────────────────────────────────
  const twoColDivs = document.querySelectorAll('.two-col');
  if (twoColDivs.length > 0) {
    if (y > PH - 70) { pdf.addPage(); y = M; }

    pdf.setFillColor(...C.accent);
    pdf.rect(M, y, 2, 5, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(50, 50, 50);
    pdf.text('CHARTS & VISUALISATIONS', M + 5, y + 3.6);
    y += 9;

    for (let i = 0; i < Math.min(twoColDivs.length, 2); i++) {
      const el = twoColDivs[i];
      try {
        const canvas = await html2canvas(el, { backgroundColor: snapBg, scale: 1.8, logging: false, useCORS: true });
        const imgH = Math.min((canvas.height / canvas.width) * CW, 80);
        if (y + imgH > PH - 20) { pdf.addPage(); y = M; }
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.3);
        pdf.rect(M, y, CW, imgH, 'S');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', M, y, CW, imgH);
        y += imgH + 6;
      } catch {}
    }
    y += 4;
  }

  // ── AI ANALYSIS TRANSCRIPT ────────────────────────────────────────────────
  if (y > PH - 50) { pdf.addPage(); y = M; }

  pdf.setFillColor(...C.accent);
  pdf.rect(M, y, 2, 5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(50, 50, 50);
  pdf.text('AI ANALYSIS TRANSCRIPT', M + 5, y + 3.6);
  y += 12;

  for (const msg of chatHistory) {
    const isBot = msg.role === 'bot';
    const blocks = parseBlocks(msg.content);

    if (isBot) {
      // ─ Bot bubble ──────────────────────────────────────────────────────
      const contentH = estimateBlocksHeight(pdf, blocks, CW);
      const totalH = contentH + (msg.navigatedTo ? 8 : 0);

      if (y + totalH + 10 > PH - 14) { pdf.addPage(); y = M; }

      // Sender row
      pdf.setFillColor(...C.accent);
      pdf.roundedRect(M, y, 5.5, 5.5, 1, 1, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(5.5);
      pdf.setTextColor(0, 0, 0);
      pdf.text('AI', M + 0.9, y + 3.8);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(...C.accent);
      pdf.text('Growth Analyst', M + 7.5, y + 3.8);
      y += 8;

      // Message box background
      const boxH = totalH + 2;
      pdf.setFillColor(...C.msgBg);
      pdf.setDrawColor(245, 158, 11);
      pdf.setLineWidth(0.15);
      pdf.roundedRect(M, y, CW, boxH, 2, 2, 'FD');

      // Amber left accent inside box
      pdf.setFillColor(...C.accent);
      pdf.rect(M, y, 1.5, boxH, 'F');

      let ty = y + 5;

      for (const block of blocks) {
        if (block.type === 'heading') {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9.5);
          pdf.setTextColor(30, 30, 30);
          pdf.text(block.text, M + 6, ty); ty += 7;
        } else if (block.type === 'para') {
          if (!block.text) { ty += 1.5; continue; }
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8.5);
          pdf.setTextColor(40, 40, 40);
          const lines = pdf.splitTextToSize(block.text, CW - 14);
          lines.forEach(l => { pdf.text(l, M + 6, ty); ty += 4.6; }); ty += 1.5;
        } else if (block.type === 'list') {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8.5);
          pdf.setTextColor(40, 40, 40);
          block.items.forEach(item => {
            pdf.setFillColor(...C.accent);
            pdf.circle(M + 9, ty - 1.2, 0.9, 'F');
            const ls = pdf.splitTextToSize(item, CW - 22);
            ls.forEach((l, li) => { pdf.text(l, M + 12, ty + li * 4.6); });
            ty += ls.length * 4.6 + 1;
          }); ty += 1;
        } else if (block.type === 'olist') {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8.5);
          block.items.forEach((item, idx) => {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...C.accent);
            pdf.text(`${idx + 1}.`, M + 7, ty);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(40, 40, 40);
            const ls = pdf.splitTextToSize(item, CW - 22);
            ls.forEach((l, li) => { pdf.text(l, M + 13, ty + li * 4.6); });
            ty += ls.length * 4.6 + 1;
          }); ty += 1;
        } else if (block.type === 'table') {
          const colCount = block.header.length;
          const colW = (CW - 16) / colCount;
          const tblX = M + 6;

          // Header row
          pdf.setFillColor(...C.accent);
          pdf.rect(tblX, ty - 3.5, CW - 16, 7, 'F');
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(6.5);
          pdf.setTextColor(0, 0, 0);
          block.header.forEach((h, ci) => {
            pdf.text(h.toUpperCase().slice(0, 14), tblX + ci * colW + 2, ty + 1.5);
          });
          ty += 7;

          block.rows.forEach((row, ri) => {
            pdf.setFillColor(ri % 2 === 0 ? 255 : 248, ri % 2 === 0 ? 255 : 248, ri % 2 === 0 ? 255 : 243);
            pdf.rect(tblX, ty - 3.5, CW - 16, 6.5, 'F');
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(7.5);
            pdf.setTextColor(40, 40, 40);
            row.forEach((cell, ci) => {
              pdf.text(String(cell).slice(0, 16), tblX + ci * colW + 2, ty + 1);
            });
            pdf.setDrawColor(230, 220, 205);
            pdf.setLineWidth(0.1);
            pdf.line(tblX, ty + 3, tblX + CW - 16, ty + 3);
            ty += 6.5;
          });
          ty += 4;
        }
      }

      if (msg.navigatedTo) {
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(7);
        pdf.setTextColor(...C.info);
        const navName = screenDefinitions[msg.navigatedTo]?.name;
        pdf.text(`⟶  Navigated to ${navName}`, M + 6, ty + 1); ty += 6;
      }

      y = Math.max(ty + 4, y + boxH + 4);

    } else {
      // ─ User bubble (right-aligned) ────────────────────────────────────
      if (y + 20 > PH - 14) { pdf.addPage(); y = M; }

      const rawText = stripInline(msg.content);
      const maxBubbleW = CW * 0.62;
      const lines = pdf.splitTextToSize(rawText, maxBubbleW - 10);
      const boxH = lines.length * 4.6 + 8;
      const boxW = Math.min(maxBubbleW, pdf.getTextWidth(rawText) + 14);
      const boxX = PW - M - boxW;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(...C.textMuted);
      pdf.text('You', PW - M, y + 3.5, { align: 'right' }); y += 6;

      pdf.setFillColor(...C.accent);
      pdf.roundedRect(boxX, y, boxW, boxH, 2.5, 2.5, 'F');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(0, 0, 0);
      lines.forEach((l, li) => { pdf.text(l, boxX + 5, y + 5 + li * 4.6); });

      y += boxH + 5;
    }
  }

  // ── FOOTER on every page ──────────────────────────────────────────────────
  const totalPages = pdf.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    pdf.setDrawColor(220, 215, 205);
    pdf.setLineWidth(0.3);
    pdf.line(M, PH - 9, PW - M, PH - 9);
    pdf.setFillColor(...C.accent);
    pdf.rect(0, PH - 1.8, PW, 1.8, 'F');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.setTextColor(160, 160, 160);
    pdf.text('CLARYNT Growth Command Centre  ·  Confidential  ·  North-2 Region', M, PH - 4);
    pdf.text(`Page ${p} / ${totalPages}`, PW - M, PH - 4, { align: 'right' });
  }

  pdf.save(`Clarynt_${currentScreenId}_${dateStr.replace(/ /g, '-')}.pdf`);
}
