"use client";

import React, { useState, useEffect } from 'react';
import { getCustomers } from '@/lib/customer-store';
import { Customer, ChemicalUsage } from '@/types/customer';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChemicalNotesDisplay from '@/components/ChemicalNotesDisplay';
import { Link } from 'react-router-dom';

const WeeklyReportsPage: React.FC = () => {
  const [weeklyLogsByCustomer, setWeeklyLogsByCustomer] = useState<
    Record<string, { customer: Customer; usages: ChemicalUsage[] }>
  >({});
  const [currentWeekRange, setCurrentWeekRange] = useState('');

  useEffect(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

    setCurrentWeekRange(
      `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`
    );

    const allCustomers = getCustomers();
    const logsMap: Record<string, { customer: Customer; usages: ChemicalUsage[] }> = {};

    allCustomers.forEach((customer) => {
      const customerWeeklyUsages: ChemicalUsage[] = [];
      customer.chemicalHistory.forEach((usage) => {
        const usageDate = new Date(usage.date);
        if (isWithinInterval(usageDate, { start: weekStart, end: weekEnd })) {
          customerWeeklyUsages.push(usage);
        }
      });

      if (customerWeeklyUsages.length > 0) {
        // Sort usages by date, newest first
        customerWeeklyUsages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        logsMap[customer.id] = { customer, usages: customerWeeklyUsages };
      }
    });

    // Sort customers by name for consistent display
    const sortedCustomerIds = Object.keys(logsMap).sort((idA, idB) =>
      logsMap[idA].customer.name.localeCompare(logsMap[idB].customer.name)
    );

    const sortedLogsMap: Record<string, { customer: Customer; usages: ChemicalUsage[] }> = {};
    sortedCustomerIds.forEach(id => {
      sortedLogsMap[id] = logsMap[id];
    });

    setWeeklyLogsByCustomer(sortedLogsMap);
  }, []);

  const hasAnyLogs = Object.keys(weeklyLogsByCustomer).length > 0;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Weekly Chemical Reports</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Week of: {currentWeekRange}</h2>
        <Separator className="mb-4" />
        {!hasAnyLogs ? (
          <p className="text-muted-foreground">No chemical usage recorded for this week across all customers.</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {Object.values(weeklyLogsByCustomer).map(({ customer, usages }) => (
              <AccordionItem key={customer.id} value={customer.id}>
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  <Link to={`/customer/${customer.id}`} className="hover:underline">
                    {customer.name}
                  </Link>
                  <span className="text-sm text-muted-foreground ml-2">({usages.length} logs)</span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {usages.map((usage, index) => (
                      <Card key={`${customer.id}-${usage.date}-${index}`} className="w-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            {format(new Date(usage.date), 'PPP')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ChemicalNotesDisplay usage={usage} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default WeeklyReportsPage;