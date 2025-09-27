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
import ChemicalNotesDisplay from './ChemicalNotesDisplay';
import { ChemicalUsage, Customer } from '@/types/customer';

interface ChemicalLogCardProps {
  usage: ChemicalUsage;
  customer?: Customer; // Optional customer prop for DailyLogsPage context
}

const ChemicalLogCard: React.FC<ChemicalLogCardProps> = ({ usage, customer }) => {
  const hasAnyNotes = Object.values(usage).some(value => typeof value === 'string' && value.trim() !== '');

  return (
    <Card className="w-full">
      <CardHeader>
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
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="px-6 py-4 text-sm text-muted-foreground hover:no-underline">
                View Chemical Notes
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 pt-0">
                <ChemicalNotesDisplay usage={usage} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <p className="px-6 pb-4 text-sm text-muted-foreground italic">No specific notes for this log.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ChemicalLogCard;