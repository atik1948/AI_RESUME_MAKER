import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { useExportFunctions } from './useExportFunctions';

const sampleResume = {
  fullName: 'Codex QA',
  email: 'codex.qa@example.com',
  phone: '+1 555 123 4567',
  linkedin: 'https://linkedin.com/in/codex-qa',
  website: 'https://example.com',
  summary: 'Frontend developer with strong React and accessibility experience.',
  skills: 'React, JavaScript, CSS',
  experiences: [
    {
      jobTitle: 'Frontend Intern',
      company: 'Tech Labs',
      startDate: 'Jun 2025',
      endDate: 'Aug 2025',
      description: 'Improved page performance and built reusable components.',
    },
  ],
  education: [
    {
      school: 'DIU',
      degree: 'BSc in CSE',
      endDate: 'May 2026',
      coursework: 'Algorithms, HCI',
    },
  ],
  projects: [
    {
      name: 'Resume Builder',
      liveUrl: 'https://example.com/demo',
      description: 'Built an AI-assisted resume builder.',
    },
  ],
};

const sections = [
  { id: 'contact' },
  { id: 'summary' },
  { id: 'education' },
  { id: 'experiences' },
  { id: 'skills' },
  { id: 'projects' },
];

function ExportHarness() {
  const { generateDocx, generatePlainText } = useExportFunctions(sampleResume, sections);

  return (
    <div>
      <button onClick={generateDocx}>Export DOCX</button>
      <button onClick={generatePlainText}>Export Text</button>
    </div>
  );
}

describe('useExportFunctions', () => {
  const originalAlert = globalThis.alert;
  const originalCreateObjectURL = globalThis.URL.createObjectURL;
  const originalRevokeObjectURL = globalThis.URL.revokeObjectURL;
  const originalAppendChild = document.body.appendChild;
  const originalRemoveChild = document.body.removeChild;

  let clickedDownloads;

  beforeEach(() => {
    clickedDownloads = [];
    globalThis.alert = vi.fn();
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:test-url');
    globalThis.URL.revokeObjectURL = vi.fn();

    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
      if (node?.tagName === 'A') {
        node.click = vi.fn(() => {
          clickedDownloads.push({
            download: node.download,
            href: node.href,
          });
        });
      }
      return originalAppendChild.call(document.body, node);
    });

    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => {
      return originalRemoveChild.call(document.body, node);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.alert = originalAlert;
    globalThis.URL.createObjectURL = originalCreateObjectURL;
    globalThis.URL.revokeObjectURL = originalRevokeObjectURL;
  });

  test('exports a DOCX file successfully', async () => {
    render(<ExportHarness />);
    await userEvent.click(screen.getByRole('button', { name: /export docx/i }));

    await waitFor(() => {
      expect(globalThis.alert).toHaveBeenCalledWith('DOCX downloaded successfully!');
    });

    expect(clickedDownloads[0]?.download).toBe('resume-Codex-QA.docx');
    expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
  });

  test('exports a plain text file successfully', async () => {
    render(<ExportHarness />);
    await userEvent.click(screen.getByRole('button', { name: /export text/i }));

    await waitFor(() => {
      expect(globalThis.alert).toHaveBeenCalledWith('Plain text downloaded successfully!');
    });

    expect(clickedDownloads[0]?.download).toBe('resume-Codex-QA.txt');
    expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
  });
});
