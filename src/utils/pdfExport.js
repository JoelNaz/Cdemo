import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { screenDefinitions } from '../data/mockData';

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&middot;/g, '·').replace(/&amp;/g, '&');
}

function wrapText(pdf, text, x, y, maxWidth, lineHeight) {
  const lines = pdf.splitTextToSize(text, maxWidth);
  lines.forEach((line) => {
    pdf.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

export async function generatePDF(chatHistory, currentScreenId) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = margin;

  // ── Header ──────────────────────────────────────────────────────────────
  pdf.setFillColor(15, 17, 23);
  pdf.rect(0, 0, pageW, 30, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  pdf.text('CLARY', margin, 18);
  pdf.setTextColor(245, 158, 11);
  pdf.text('NT', margin + pdf.getTextWidth('CLARY'), 18);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(180, 180, 180);
  pdf.text('Growth Command Centre — AI Analysis Report', margin + 44, 18);

  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  pdf.text(dateStr, pageW - margin - pdf.getTextWidth(dateStr), 18);

  y = 38;

  // ── Screen context ───────────────────────────────────────────────────────
  const screenName = screenDefinitions[currentScreenId]?.name || 'Command Centre';
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(30, 30, 30);
  pdf.text(`Analysis Session: ${screenName}`, margin, y);
  y += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Region: North-2 · Role: RSM · Period: March 2026 · Exported: ${dateStr}`, margin, y);
  y += 10;

  // Divider
  pdf.setDrawColor(220, 220, 220);
  pdf.line(margin, y, pageW - margin, y);
  y += 8;

  // ── Conversation ─────────────────────────────────────────────────────────
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(30, 30, 30);
  pdf.text('Conversation Transcript', margin, y);
  y += 6;

  for (const msg of chatHistory) {
    if (y > pageH - 30) {
      pdf.addPage();
      y = margin;
    }

    const isBot = msg.role === 'bot';
    const label = isBot ? '🤖 AI Analyst' : '👤 You';
    const bgColor = isBot ? [235, 245, 255] : [245, 250, 235];

    // Role label
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(isBot ? 37 : 22, isBot ? 99 : 101, isBot ? 235 : 52);
    pdf.text(isBot ? 'AI Analyst' : 'You', margin, y);
    y += 4;

    // Content
    const rawText = stripHtml(msg.content || '');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(40, 40, 40);
    const lines = pdf.splitTextToSize(rawText, contentW - 4);

    // Background box
    const boxH = lines.length * 4.5 + 8;
    if (y + boxH > pageH - 20) {
      pdf.addPage();
      y = margin;
    }
    pdf.setFillColor(...bgColor);
    pdf.setDrawColor(200, 200, 200);
    pdf.roundedRect(margin, y, contentW, boxH, 2, 2, 'FD');

    let ty = y + 5;
    lines.forEach(line => {
      pdf.text(line, margin + 4, ty);
      ty += 4.5;
    });

    if (msg.navigatedTo) {
      ty += 1;
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 100, 200);
      pdf.text(`→ Navigated to: ${screenDefinitions[msg.navigatedTo]?.name}`, margin + 4, ty);
      ty += 4;
    }

    y = y + boxH + 5;
  }

  // ── Screenshots of charts ─────────────────────────────────────────────
  const chartContainers = document.querySelectorAll('.chart-container');
  if (chartContainers.length > 0) {
    if (y > pageH - 60) {
      pdf.addPage();
      y = margin;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 30, 30);
    pdf.text('Dashboard Charts', margin, y);
    y += 6;

    for (let i = 0; i < Math.min(chartContainers.length, 4); i++) {
      try {
        const canvas = await html2canvas(chartContainers[i], {
          backgroundColor: '#1e2230',
          scale: 1.5,
          logging: false,
          useCORS: true,
        });
        const imgData = canvas.toDataURL('image/png');
        const imgW = contentW;
        const imgH = (canvas.height / canvas.width) * imgW;

        if (y + imgH > pageH - 20) {
          pdf.addPage();
          y = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, y, imgW, imgH);
        y += imgH + 6;
      } catch (e) {
        // skip if capture fails
      }
    }
  }

  // ── KPI snapshot ─────────────────────────────────────────────────────────
  const kpiCards = document.querySelectorAll('.kpi-card');
  if (kpiCards.length > 0 && y > margin) {
    if (y > pageH - 80) {
      pdf.addPage();
      y = margin;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 30, 30);
    pdf.text('KPI Snapshot', margin, y);
    y += 6;

    try {
      const kpiStrip = document.querySelector('.kpi-strip');
      if (kpiStrip) {
        const canvas = await html2canvas(kpiStrip, {
          backgroundColor: '#1a1d27',
          scale: 1.5,
          logging: false,
          useCORS: true,
        });
        const imgData = canvas.toDataURL('image/png');
        const imgH = Math.min((canvas.height / canvas.width) * contentW, 50);
        pdf.addImage(imgData, 'PNG', margin, y, contentW, imgH);
        y += imgH + 6;
      }
    } catch (e) {}
  }

  // ── Footer ────────────────────────────────────────────────────────────
  const totalPages = pdf.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(160, 160, 160);
    pdf.text('CLARYNT Growth Command Centre · Confidential · April 2026', margin, pageH - 8);
    pdf.text(`Page ${p} of ${totalPages}`, pageW - margin - 20, pageH - 8);
    pdf.setDrawColor(220, 220, 220);
    pdf.line(margin, pageH - 12, pageW - margin, pageH - 12);
  }

  pdf.save(`Clarynt_Analysis_${currentScreenId}_${Date.now()}.pdf`);
}
