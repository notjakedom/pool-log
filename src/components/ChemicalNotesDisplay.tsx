"use client";

import React from 'react';
import { ChemicalUsage } from '@/types/customer';

interface ChemicalNotesDisplayProps {
  usage: ChemicalUsage;
}

const ChemicalNotesDisplay: React.FC<ChemicalNotesDisplayProps> = ({ usage }) => {
  const chemicalFields = [
    { label: 'Chlorine', value: usage.chlorine },
    { label: 'pH', value: usage.ph },
    { label: 'Alkalinity', value: usage.alkalinity },
    { label: 'Calcium Hardness', value: usage.calciumHardness },
    { label: 'Cyanuric Acid', value: usage.cyanuricAcid },
  ];

  const hasChemicalNotes = chemicalFields.some(field => field.value);

  return (
    <div className="space-y-1 text-sm text-muted-foreground">
      {hasChemicalNotes && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {chemicalFields.map((field, index) => (
            field.value && (
              <p key={index}>
                <span className="font-medium">{field.label}:</span> {field.value}
              </p>
            )
          ))}
        </div>
      )}
      {usage.notes && (
        <p className={hasChemicalNotes ? "pt-2 italic border-t border-border mt-2" : "italic"}>
          General Notes: {usage.notes}
        </p>
      )}
      {!hasChemicalNotes && !usage.notes && (
        <p className="italic">No specific notes for this log.</p>
      )}
    </div>
  );
};

export default ChemicalNotesDisplay;