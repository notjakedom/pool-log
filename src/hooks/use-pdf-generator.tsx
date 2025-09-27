"use client";

import React, { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface UsePdfGeneratorResult {
  generatePdf: (element: HTMLElement | null, filename: string) => Promise<void>;
}

export function usePdfGenerator(): UsePdfGeneratorResult {
  const generatePdf = useCallback(async (element: HTMLElement | null, filename: string) => {
    if (!element) {
      console.error("Element for PDF generation not found.");
      return;
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

      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }, []);

  return { generatePdf };
}