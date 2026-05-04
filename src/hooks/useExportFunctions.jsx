import { useState } from 'react';
import { normalizeResumeData, skillsToText } from '../utils/resumeData';

export const useExportFunctions = (formData, sectionOrder) => {
  const [exporting, setExporting] = useState(false);

  const generateDocx = async () => {
    setExporting(true);
    try {
      const resumeData = normalizeResumeData(formData);
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        HeadingLevel,
        AlignmentType,
        UnderlineType,
      } = await import('docx');

      const doc = new Document({
        sections: [
          {
            children: sectionOrder.map(section => {
              switch (section.id) {
                case 'contact':
                  return [
                    new Paragraph({
                      text: resumeData.fullName || 'Your Name',
                      heading: HeadingLevel.TITLE,
                      alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                      text: `${resumeData.email || ''} | ${resumeData.phone || ''} | ${resumeData.linkedin || ''} | ${resumeData.website || ''}`,
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 200 },
                    }),
                  ];
                case 'summary':
                  return [
                    new Paragraph({
                      text: 'Professional Summary',
                      heading: HeadingLevel.HEADING_2,
                      underline: { type: UnderlineType.SINGLE, color: '000000' },
                      spacing: { after: 100 },
                    }),
                    new Paragraph({
                      text: resumeData.summary || '',
                      spacing: { after: 200 },
                    }),
                  ];
                case 'experiences':
                  return [
                    new Paragraph({
                      text: 'Work Experience',
                      heading: HeadingLevel.HEADING_2,
                      underline: { type: UnderlineType.SINGLE, color: '000000' },
                      spacing: { after: 100 },
                    }),
                    ...(resumeData.experiences || []).map(exp => [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${exp.jobTitle || ''} at ${exp.company || ''}`, bold: true }),
                          new TextRun({ text: ` (${exp.startDate || ''} - ${exp.endDate || ''})`, break: 1 }),
                        ],
                      }),
                      new Paragraph({
                        text: exp.responsibilities || '',
                        spacing: { after: 100 },
                      }),
                    ]).flat(),
                  ];
                case 'education':
                  return [
                    new Paragraph({
                      text: 'Education',
                      heading: HeadingLevel.HEADING_2,
                      underline: { type: UnderlineType.SINGLE, color: '000000' },
                      spacing: { after: 100 },
                    }),
                    ...(resumeData.education || []).map(edu => [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${edu.degree || ''}, ${edu.school || ''}`, bold: true }),
                          new TextRun({ text: ` (${edu.graduationYear || ''})`, break: 1 }),
                        ],
                      }),
                      new Paragraph({
                        text: edu.coursework || '',
                        spacing: { after: 100 },
                      }),
                    ]).flat(),
                  ];
                case 'skills':
                  return [
                    new Paragraph({
                      text: 'Skills',
                      heading: HeadingLevel.HEADING_2,
                      underline: { type: UnderlineType.SINGLE, color: '000000' },
                      spacing: { after: 100 },
                    }),
                    new Paragraph({
                      text: skillsToText(resumeData.skills),
                      spacing: { after: 200 },
                    }),
                  ];
                case 'projects':
                  return [
                    new Paragraph({
                      text: 'Projects',
                      heading: HeadingLevel.HEADING_2,
                      underline: { type: UnderlineType.SINGLE, color: '000000' },
                      spacing: { after: 100 },
                    }),
                    ...(resumeData.projects || []).map(proj => [
                      new Paragraph({
                        children: [
                          new TextRun({ text: proj.projectName || '', bold: true }),
                          new TextRun({ text: ` (${proj.projectLink || ''})`, break: 1 }),
                        ],
                      }),
                      new Paragraph({
                        text: proj.projectDescription || '',
                        spacing: { after: 100 },
                      }),
                    ]).flat(),
                  ];
                default:
                  return [];
              }
            }).flat(),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${resumeData.fullName?.replace(/\s+/g, '-') || 'resume'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('DOCX downloaded successfully!');
    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert('Error generating DOCX. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const generatePlainText = () => {
    setExporting(true);
    try {
      let plainTextContent = '';
      const resumeData = normalizeResumeData(formData);

      sectionOrder.forEach(section => {
        switch (section.id) {
          case 'contact':
            plainTextContent += `Name: ${resumeData.fullName || ''}\n`;
            plainTextContent += `Email: ${resumeData.email || ''}\n`;
            plainTextContent += `Phone: ${resumeData.phone || ''}\n`;
            plainTextContent += `LinkedIn: ${resumeData.linkedin || ''}\n`;
            plainTextContent += `Website: ${resumeData.website || ''}\n\n`;
            break;
          case 'summary':
            plainTextContent += `Professional Summary:\n${resumeData.summary || ''}\n\n`;
            break;
          case 'experiences':
            if (resumeData.experiences && resumeData.experiences.length > 0) {
              plainTextContent += 'Work Experience:\n';
              resumeData.experiences.forEach(exp => {
                plainTextContent += `  ${exp.jobTitle || ''} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || ''})\n`;
                if (exp.responsibilities) {
                  plainTextContent += `    ${exp.responsibilities}\n`;
                }
              });
              plainTextContent += '\n';
            }
            break;
          case 'education':
            if (resumeData.education && resumeData.education.length > 0) {
              plainTextContent += 'Education:\n';
              resumeData.education.forEach(edu => {
                plainTextContent += `  ${edu.degree || ''}, ${edu.school || ''} (${edu.graduationYear || ''})\n`;
                if (edu.coursework) {
                  plainTextContent += `    Coursework: ${edu.coursework}\n`;
                }
                plainTextContent += '\n';
              });
            }
            break;
          case 'skills':
            if (resumeData.skills && resumeData.skills.length > 0) {
              plainTextContent += `Skills: ${skillsToText(resumeData.skills)}\n\n`;
            }
            break;
          case 'projects':
            if (resumeData.projects && resumeData.projects.length > 0) {
              plainTextContent += 'Projects:\n';
              resumeData.projects.forEach(proj => {
                plainTextContent += `  ${proj.projectName || ''} (${proj.projectLink || ''})\n`;
                plainTextContent += `    ${proj.projectDescription || ''}\n\n`;
              });
            }
            break;
          default:
            break;
        }
      });

      const blob = new Blob([plainTextContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${resumeData.fullName?.replace(/\s+/g, '-') || 'resume'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Plain text downloaded successfully!');
    } catch (error) {
      console.error('Error generating plain text:', error);
      alert('Error generating plain text. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return {
    generateDocx,
    generatePlainText,
    exporting
  };
};
