"use client";

import React, { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface UsePdfGeneratorResult {
  generatePdf: (element: HTMLElement | null) => Promise<string | null>;
  downloadPdf: (pdfDataUrl: string, filename: string) => void;
}

export function usePdfGenerator(): UsePdfGeneratorResult {
  const generatePdf = useCallback(async (element: HTMLElement | null) => {
    console.log("usePdfGenerator: generatePdf called. Element:", element);
    if (!element) {
      console.error("usePdfGenerator: Element for PDF generation not found.");
      return null;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Important if you have images from external sources
      });
      console.log("usePdfGenerator: Canvas generated:", canvas);

      const imgData = canvas.toDataURL('image/png');
      console.log("usePdfGenerator: Image data generated (first 100 chars):", imgData.substring(0, 100));

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      console.log("usePdfGenerator: PDF generated successfully.");
      return pdf.output('datauristring'); // Return the PDF as a Data URL
    } catch (error) {
      console.error("usePdfGenerator: Error generating PDF:", error);
      return null;
    }
  }, []);

  const downloadPdf = useCallback((pdfDataUrl: string, filename: string) => {
    console.log("usePdfGenerator: downloadPdf called for filename:", filename);
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return { generatePdf, downloadPdf };
}