import jsPDF from 'jspdf';
import type { Analysis } from '../types';

export function generatePDF(analysis: Analysis): void {
  const doc = new jsPDF();
  const { repository, scores, reviews, interviewQuestions, resumeBullets } = analysis;
  let y = 20;
  const leftMargin = 20;
  const pageWidth = 170;
  const lineHeight = 7;

  function checkNewPage(neededSpace: number = 30) {
    if (y > 270 - neededSpace) {
      doc.addPage();
      y = 20;
    }
  }

  function addTitle(text: string) {
    checkNewPage(20);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text(text, leftMargin, y);
    y += 10;
  }

  function addSubtitle(text: string) {
    checkNewPage(15);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 80);
    doc.text(text, leftMargin, y);
    y += 8;
  }

  function addText(text: string, indent: number = 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 100);
    const lines = doc.splitTextToSize(text, pageWidth - indent);
    lines.forEach((line: string) => {
      checkNewPage(10);
      doc.text(line, leftMargin + indent, y);
      y += lineHeight - 1;
    });
    y += 2;
  }

  function addBullet(text: string, indent: number = 5) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 100);
    const lines = doc.splitTextToSize(text, pageWidth - indent - 5);
    lines.forEach((line: string, i: number) => {
      checkNewPage(10);
      if (i === 0) {
        doc.text('•', leftMargin + indent, y);
      }
      doc.text(line, leftMargin + indent + 5, y);
      y += lineHeight - 1;
    });
    y += 1;
  }

  function addScoreBar(label: string, score: number) {
    checkNewPage(15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 80);
    doc.text(`${label}: ${score}%`, leftMargin, y);

    // Background bar
    doc.setFillColor(230, 230, 240);
    doc.roundedRect(leftMargin + 60, y - 4, 100, 6, 2, 2, 'F');

    // Score bar
    const color = score >= 80 ? [16, 185, 129] : score >= 65 ? [34, 211, 238] : score >= 50 ? [245, 158, 11] : [239, 68, 68];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(leftMargin + 60, y - 4, score, 6, 2, 2, 'F');

    y += 10;
  }

  function addDivider() {
    checkNewPage(10);
    doc.setDrawColor(200, 200, 220);
    doc.line(leftMargin, y, leftMargin + pageWidth, y);
    y += 8;
  }

  // === COVER SECTION ===
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, 210, 60, 'F');

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('AI Engineering Review Report', leftMargin, 30);

  doc.setFontSize(12);
  doc.setTextColor(180, 180, 220);
  doc.text(`Repository: ${repository.fullName}`, leftMargin, 42);
  doc.text(`Generated: ${new Date(analysis.createdAt).toLocaleDateString()}`, leftMargin, 52);

  y = 75;

  // === REPOSITORY INFO ===
  addTitle('Repository Information');
  addText(`Name: ${repository.fullName}`);
  addText(`Description: ${repository.description}`);
  addText(`Primary Language: ${repository.language}`);
  addText(`Stars: ${repository.stars.toLocaleString()} | Forks: ${repository.forks.toLocaleString()} | Issues: ${repository.openIssues}`);
  addText(`License: ${repository.license || 'Not specified'}`);
  addText(`Topics: ${repository.topics.join(', ')}`);
  y += 5;

  // === SCORES ===
  addDivider();
  addTitle('Engineering Scores');
  addScoreBar('Architecture', scores.architecture);
  addScoreBar('Security', scores.security);
  addScoreBar('Cloud Readiness', scores.cloudReadiness);
  addScoreBar('Maintainability', scores.maintainability);
  addScoreBar('Performance', scores.performance);
  y += 3;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(99, 102, 241);
  doc.text(`Overall Score: ${scores.overall}%`, leftMargin, y);
  y += 12;

  // === REVIEWS ===
  const reviewEntries = [
    { title: 'Architecture Review', review: reviews.architecture },
    { title: 'Security Review', review: reviews.security },
    { title: 'Cloud Readiness Review', review: reviews.cloud },
    { title: 'Performance Review', review: reviews.performance },
  ];

  for (const { title, review } of reviewEntries) {
    addDivider();
    addTitle(title);
    addText(review.summary);
    y += 3;

    addSubtitle('Key Findings');
    for (const finding of review.findings) {
      const severityLabel = `[${finding.severity.toUpperCase()}]`;
      addBullet(`${severityLabel} ${finding.title}: ${finding.description}`);
    }
    y += 3;

    addSubtitle('Recommendations');
    for (const rec of review.recommendations) {
      addBullet(rec);
    }
    y += 5;
  }

  // === INTERVIEW QUESTIONS ===
  addDivider();
  addTitle('Interview Questions');
  for (const q of interviewQuestions.slice(0, 7)) {
    checkNewPage(25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 80);
    const qLines = doc.splitTextToSize(`Q${q.id}. [${q.category}] ${q.question}`, pageWidth);
    qLines.forEach((line: string) => {
      checkNewPage(10);
      doc.text(line, leftMargin, y);
      y += lineHeight - 1;
    });
    y += 1;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 120);
    const aLines = doc.splitTextToSize(`Expected: ${q.expectedAnswer}`, pageWidth - 5);
    aLines.forEach((line: string) => {
      checkNewPage(10);
      doc.text(line, leftMargin + 5, y);
      y += lineHeight - 1;
    });
    y += 4;
  }

  // === RESUME BULLETS ===
  addDivider();
  addTitle('Resume Bullet Points');
  for (const b of resumeBullets) {
    addBullet(b.bullet);
  }

  // === FOOTER ON ALL PAGES ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 170);
    doc.text(
      `AI Engineering Review Assistant | Page ${i} of ${totalPages}`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save(`${repository.name}-engineering-review.pdf`);
}
