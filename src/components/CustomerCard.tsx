"use client";

import React from 'react';
import { Customer } from '@/types/customer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
import DeleteCustomerDialog from './DeleteCustomerDialog';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { format } from 'date-fns';

interface CustomerCardProps {
  customer: Customer;
  onDelete: (id: string) => void;
  onEdit: (customer: Customer) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onDelete, onEdit }) => {
  const latestUsage = customer.chemicalHistory.length > 0 ? customer.chemicalHistory[0] : null;

  const chemicalFields = latestUsage ? [
    { label: 'Chlorine', value: latestUsage.chlorine, id: 'chlorine' },
    { label: 'pH', value: latestUsage.ph, id: 'ph' },
    { label: 'Alkalinity', value: latestUsage.alkalinity, id: 'alkalinity' },
    { label: 'Calcium Hardness', value: latestUsage.calciumHardness, id: 'calciumHardness' },
    { label: 'Cyanuric Acid', value: latestUsage.cyanuricAcid, id: 'cyanuricAcid' },
  ] : [];

  const hasAnySpecificNotes = chemicalFields.some(field => field.value && field.value.trim() !== '');
  const hasGeneralNotes = latestUsage?.notes && latestUsage.notes.trim() !== '';
  const hasAnyNotes = hasAnySpecificNotes || hasGeneralNotes;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <Link to={`/customer/${customer.id}?openLog=true`} className="hover:underline">
            {customer.name}
          </Link>
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(customer)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteCustomerDialog
            customerName={customer.name}
            onConfirm={() => onDelete(customer.id)}
          >
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </DeleteCustomerDialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 pb-4">
          <p className="text-sm text-muted-foreground">{customer.address}</p>
          <p className="text-sm text-muted-foreground">Pool Day: {customer.poolDay}</p>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-md font-semibold px-6 mb-2">Latest Chemical Log:</h4>
          {latestUsage ? (
            <div className="px-6 pb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Date: {format(new Date(latestUsage.date), 'PPP')}
              </p>
              {hasAnyNotes ? (
                <Accordion type="multiple" className="w-full">
                  {chemicalFields.map((field) => (
                    field.value && (
                      <AccordionItem key={field.id} value={field.id} className="border-b px-0">
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
                    <AccordionItem value="general-notes" className="border-b-0 px-0">
                      <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        General Log Notes
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-0 text-muted-foreground text-sm">
                        {latestUsage.notes}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              ) : (
                <p className="text-sm text-muted-foreground italic">No specific notes for this log.</p>
              )}
            </div>
          ) : (
            <p className="px-6 pb-4 text-sm text-muted-foreground italic">No chemical usage recorded yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;