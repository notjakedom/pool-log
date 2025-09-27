"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChemicalUsage, Customer } from '@/types/customer';

interface ChemicalLogCardProps {
  usage: ChemicalUsage;
  customer?: Customer; // Optional customer prop for DailyLogsPage context
}

const ChemicalLogCard: React.FC<ChemicalLogCardProps> = ({ usage, customer }) => {
  const chemicalFields = [
    { label: 'Chlorine', value: usage.chlorine, id: 'chlorine' },
    { label: 'pH', value: usage.ph, id: 'ph' },
    { label: 'Alkalinity', value: usage.alkalinity, id: 'alkalinity' },
    { label: 'Calcium Hardness', value: usage.calciumHardness, id: 'calciumHardness' },
    { label: 'Cyanuric Acid', value: usage.cyanuricAcid, id: 'cyanuricAcid' },
  ];

  const hasAnySpecificNotes = chemicalFields.some(field => field.value && field.value.trim() !== '');
  const hasGeneralNotes = usage.notes && usage.notes.trim() !== '';
  const hasAnyNotes = hasAnySpecificNotes || hasGeneralNotes;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {customer ? (
            <Link to={`/customer/${customer.id}`} className="hover:underline">
              {customer.name} - {format(new Date(usage.date), 'PPP')}
            </Link>
          ) : (
            format(new Date(usage.date), 'PPP')
          )}
        </CardTitle>
        {customer && (
          <p className="text-sm text-muted-foreground">{customer.address}</p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {hasAnyNotes ? (
          <Accordion type="multiple" className="w-full">
            {chemicalFields.map((field) => (
              field.value && (
                <AccordionItem key={field.id} value={field.id} className="border-b px-6">
                  <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                    {field.label} Notes
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 pt-0 text-muted-foreground text-sm">
                    {field.value}
                  </AccordionContent>
                </AccordionItem>
              )
            ))}
            {hasGeneralNotes && (
              <AccordionItem value="general-notes" className="border-b-0 px-6">
                <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                  General Log Notes
                </AccordionTrigger>
                <AccordionContent className="pb-2 pt-0 text-muted-foreground text-sm">
                  {usage.notes}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        ) : (
          <p className="px-6 pb-4 text-sm text-muted-foreground italic">No specific notes for this log.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ChemicalLogCard;