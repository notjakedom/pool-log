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
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import DeleteChemicalLogDialog from './DeleteChemicalLogDialog'; // Import the new dialog

interface ChemicalLogCardProps {
  usage: ChemicalUsage;
  customer?: Customer; // Optional customer prop for DailyLogsPage context
  onDeleteLog?: (usageId: string) => void; // New prop for delete functionality
}

const ChemicalLogCard: React.FC<ChemicalLogCardProps> = ({ usage, customer, onDeleteLog }) => {
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
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
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
        </div>
        {onDeleteLog && (
          <DeleteChemicalLogDialog
            logDate={format(new Date(usage.date), 'PPP')}
            onConfirm={() => onDeleteLog(usage.id)}
          >
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteChemicalLogDialog>
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