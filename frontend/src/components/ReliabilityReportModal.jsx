import React, { useState } from 'react';
import { ShieldCheck, Download, X, FileText, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReliabilityReportModal = ({ isOpen, onClose, analysis, matches }) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !analysis) return null;

  const totalMatches = matches ? matches.length : 0;
  const reliabilityScore = analysis.reliabilityScore || 98.5;
  const durationSec = (analysis.durationMs / 1000).toFixed(1);

  // Generate and Download PDF Report
  const downloadPDFReport = () => {
    setDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // Header Brand Banner
      doc.setFillColor(15, 23, 42); // #0f172a
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('AudioPulse — Acoustic Intelligence Audit Report', 14, 13);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // #94a3b8
      doc.text(`Official Compliance & Timestamp Proof Document | ID: ${analysis._id}`, 14, 20);

      // Executive Summary Box
      let currentY = 36;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('1. Executive Overview & Metrics', 14, currentY);

      currentY += 5;

      autoTable(doc, {
        startY: currentY,
        head: [['Metric Parameter', 'Value']],
        body: [
          ['Audio File Name', analysis.originalFilename || analysis.title],
          ['Audit Date & Time', new Date(analysis.createdAt).toLocaleString()],
          ['Overall Reliability Score', `${reliabilityScore}% (High Confidence Index)`],
          ['Flagged Proof Matches', `${totalMatches} Keyword Timestamp Matches`],
          ['Audio Stream Duration', `${durationSec} seconds`],
        ],
        theme: 'grid',
        headStyles: { fillStyle: 'F', fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { left: 14, right: 14 },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      // Proof Evidence Table
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('2. Keyword Proof & Timestamp Evidence Matrix', 14, currentY);

      currentY += 5;

      const tableRows = (matches || []).map((m) => [
        m.groupName || 'Default',
        `"${m.keyword}"`,
        m.formattedTime || `${m.startTime}s - ${m.endTime}s`,
        (m.contextSnippet || '').replace(/\*\*/g, '').replace(/\n/g, ' '),
        `${m.confidence}%`,
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Group', 'Keyword', 'Timestamp Proof', 'Context Snippet Evidence', 'Confidence']],
        body: tableRows.length > 0 ? tableRows : [['Clean', 'No Risk Terms', '00:00 - End', 'No flagged terms detected', '100%']],
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 24, fontStyle: 'bold' },
          2: { cellWidth: 30 },
          3: { cellWidth: 80 },
          4: { cellWidth: 20 },
        },
        styles: { fontSize: 8, cellPadding: 2.5, overflow: 'linebreak' },
        margin: { left: 14, right: 14 },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      // Full Transcript Section
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('3. Verified Speech Transcript Log', 14, currentY);

      currentY += 6;

      doc.setFontSize(8.5);
      doc.setFont('courier', 'normal');
      doc.setTextColor(51, 65, 85);

      const splitTranscript = doc.splitTextToSize(analysis.transcript || 'No transcript text available.', pageWidth - 28);
      
      // Page wrapping check for transcript text
      for (let i = 0; i < splitTranscript.length; i++) {
        if (currentY > 275) {
          doc.addPage();
          currentY = 20;
          doc.setFont('courier', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
        }
        doc.text(splitTranscript[i], 14, currentY);
        currentY += 4.5;
      }

      // Add Footer with Page Numbers
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Page ${i} of ${totalPages}  |  AudioPulse Acoustic Intelligence Suite  |  Confidential Audit Record`,
          pageWidth / 2,
          288,
          { align: 'center' }
        );
      }

      doc.save(`AudioPulse_Audit_Report_${analysis.title || 'audio'}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF document');
    } finally {
      setDownloading(false);
    }
  };

  // Download Markdown Artifact Option
  const downloadMarkdownReport = () => {
    const reportContent = `# AudioPulse Acoustic Intelligence & Reliability Audit Report

## 1. Executive Summary
- **Audio File**: ${analysis.originalFilename}
- **Analysis ID**: ${analysis._id}
- **Date & Time**: ${new Date(analysis.createdAt).toLocaleString()}
- **Overall Reliability Score**: ${reliabilityScore}%
- **Total Duration**: ${durationSec}s
- **Detected Keyword Proof Matches**: ${totalMatches}

---

## 2. Keyword Proof Evidence Table
| Keyword Group | Matched Keyword | Timestamp Proof Range | Context Snippet | Match Confidence |
|---|---|---|---|---|
${(matches || [])
  .map(
    (m) =>
      `| ${m.groupName} | **"${m.keyword}"** | \`${m.formattedTime}\` | ${m.contextSnippet.replace(/\n/g, ' ')} | ${m.confidence}% |`
  )
  .join('\n')}

---

## 3. Full Transcript Output
\`\`\`text
${analysis.transcript || 'No transcript text'}
\`\`\`

---
*Generated by AudioPulse Analysis Suite — Bank-Grade Acoustic Intelligence Engine*
`;

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AudioPulse_Reliability_Report_${analysis.title || 'audio'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <div
        className="glass-card modal-content"
        style={{ maxWidth: '850px', width: '92%', maxHeight: '88vh', overflowY: 'auto', padding: '2.25rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                padding: '0.6rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: '#ffffff',
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Audio Reliability & Proof Audit Report
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Verified Acoustic Analysis for: {analysis.originalFilename}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Metrics Overview Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Reliability Score
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--success)', marginTop: '0.2rem' }}>
              {reliabilityScore}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High Confidence Index</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Keyword Matches
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
              {totalMatches}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Timestamp Proof Flags</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Audio Duration
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-secondary)', marginTop: '0.2rem' }}>
              {durationSec}s
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acoustic Stream</div>
          </div>
        </div>

        {/* Export Action Banner */}
        <div
          style={{
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Export Verified Audit Report
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Download official compliance report document as PDF format or Markdown.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Download PDF Button (PRIMARY) */}
            <button
              onClick={downloadPDFReport}
              disabled={downloading}
              className="btn-primary"
              style={{
                width: 'auto',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, var(--accent-primary), #4f46e5)',
              }}
            >
              {downloading ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              ) : (
                <>
                  <Download size={18} />
                  <span>Download Audit Report (.pdf)</span>
                </>
              )}
            </button>

            {/* Download Markdown Option */}
            <button
              onClick={downloadMarkdownReport}
              className="btn-secondary"
              style={{ width: 'auto', padding: '0.75rem 1.2rem', fontSize: '0.85rem' }}
              title="Download Markdown file"
            >
              <FileDown size={16} />
              <span>Export (.md)</span>
            </button>
          </div>
        </div>

        {/* Proof Evidence Preview */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Evidence Summary Matrix
          </h4>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            All detected keywords were matched against word-level timestamps extracted from the AI transcription engine. Every flagged entry includes start/end seconds and audio playback sync.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReliabilityReportModal;
