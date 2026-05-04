import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { templates } from '../templates/templateRegistry';
import { normalizeResumeData } from '../utils/resumeData';
import { getPdfFontScale, normalizePdfSectionOrder, parsePdfFontSize } from '../utils/pdfResume';

const TemplatePreview = forwardRef(({
  selectedTemplate,
  formData,
  accentColor,
  fontStyle,
  fontSize,
  sectionOrder,
  className = '',
  autoScale = true,
  // showControls = true,
  enableInteractions = true,
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const previewRef = useRef(null);
  const downloadLinkRef = useRef(null);

  const templateObj = templates.find(t => t.id === selectedTemplate);
  const TemplateComponent = templateObj?.component;

  // Validate template component
  if (!templateObj || !TemplateComponent) {
    console.warn(`Template not found or invalid: ${selectedTemplate}`);
  }

  // Expose download functionality to parent component
  useImperativeHandle(ref, () => ({
    downloadPDF: () => {
      if (downloadLinkRef.current && !downloadLoading) {
        try {
          downloadLinkRef.current.click();
          console.log('PDF download initiated');
        } catch (error) {
          console.error('Error clicking download link:', error);
          setDownloadError(error);
        }
      } else {
        console.warn('Download link not available or download already in progress');
      }
    },
    isLoading: downloadLoading,
    hasError: !!downloadError
  }));

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedTemplate, accentColor, fontStyle, fontSize]);

  // Ensure download link is ready
  useEffect(() => {
    if (downloadLinkRef.current) {
      console.log('Download link ready');
    }
  }, [downloadLinkRef.current]);

  // Debounced effect to prevent excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      // Clear any stale errors after a delay
      if (downloadError) {
        setDownloadError(null);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [downloadError]);



  const handleDownloadStart = () => {
    if (!downloadLoading) {
      setDownloadLoading(true);
      setDownloadError(null);
    }
  };

  const handleDownloadSuccess = () => {
    setDownloadLoading(false);
    setDownloadError(null);
  };

  const handleDownloadError = (error) => {
    setDownloadLoading(false);
    setDownloadError(error);
    console.error('PDF Download Error:', error);
  };




  if (!TemplateComponent) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-8 border dark:border-neutral-700 shadow-sm text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 text-white rounded-xl flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Template Preview</h3>
          <p className="text-gray-600 dark:text-gray-400">Select a template and enter your details to see the preview.</p>
        </div>
      </div>
    );
  }

  const templateProps = {
    formData: normalizeResumeData(formData || {}),
    accentColor: accentColor || '#3B82F6',
    fontStyle: fontStyle || 'sans',
    fontSize: parsePdfFontSize(fontSize, 11),
    fontScale: getPdfFontScale(fontSize, 10),
    sectionOrder: normalizePdfSectionOrder(sectionOrder || []),
  };

  // Generate filename
  const generateFileName = () => {
    try {
      const name = formData?.fullName?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'resume';
      const templateName = templateObj?.name?.replace(/\s+/g, '_') || 'template';
      return `${name}_${templateName}.pdf`;
    } catch (error) {
      console.error('Error generating filename:', error);
      return 'resume.pdf';
    }
  };

  const PreviewHeader = () => (
    <div className="bg-white dark:bg-neutral-800 border-b dark:border-neutral-700 sticky top-0 z-50 p-4 shadow-sm flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold shadow">
          {templateObj.preview?.[0] || '📄'}
        </div>
        <div>
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">{templateObj.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{templateObj.description}</p>
        </div>
      </div>

      {/* Hidden PDFDownloadLink for external download functionality - always rendered */}
      <div className="hidden">
        <PDFDownloadLink
          ref={downloadLinkRef}
          document={<TemplateComponent {...templateProps} />}
          fileName={generateFileName()}
          onLoadStart={handleDownloadStart}
          onLoadEnd={handleDownloadSuccess}
          onError={handleDownloadError}
        >
          {() => <span>Download</span>}
        </PDFDownloadLink>
      </div>
    </div>
  );

  const PreviewContent = () => (
    <div className="relative flex-1 w-full h-full overflow-hidden p-2 bg-slate-50 dark:bg-neutral-900">
      {isLoading && (
        <div className="absolute inset-0 bg-white dark:bg-neutral-900 bg-opacity-80 dark:bg-opacity-80 z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Generating Preview...</p>
        </div>
      )}

      {downloadError && (
        <div className="absolute top-4 right-4 z-50 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Download failed. Please try again.
          </div>
        </div>
      )}

      <div className="w-full h-full flex justify-center items-start">
        <div
          ref={previewRef}
          className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg transition-transform border dark:border-neutral-700 w-full h-full"
        >
          <PDFViewer
            width="100%"
            height="100%"
            style={{ 
              border: 'none', 
              width: '100%',
              height: '100%',
              minHeight: '600px',
              display: 'block'
            }}
            showToolbar={false}
          >
            <TemplateComponent {...templateProps} />
          </PDFViewer>
        </div>
      </div>
{/* 
      {enableInteractions && (
        <div className="mt-6 flex flex-wrap items-center justify-between bg-white dark:bg-neutral-800 rounded-lg border dark:border-neutral-700 p-4 shadow-sm gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live Preview</span>
          </div>
        </div>
      )} */}
    </div>
  );

  return (
    <div className={`rounded-xl border dark:border-neutral-700 shadow-sm overflow-hidden w-full ${className}`}>
      {<PreviewHeader />}
      <PreviewContent />
    </div>
  );
});

TemplatePreview.displayName = 'TemplatePreview';

export default TemplatePreview;
