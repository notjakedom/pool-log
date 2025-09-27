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
    if (!element) {
      console.error("Element for PDF generation not found.");
      return null;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Important if you have images from external sources
      });

      const imgData = canvas.toDataURL('image/png');
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

      return pdf.output('datauristring'); // Return the PDF as a Data URL
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  }, []);

  const downloadPdf = useCallback((pdfDataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return { generatePdf, downloadPdf };
}