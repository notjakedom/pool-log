"use client";

import React, { useState, useEffect } from 'react';
import { getCustomers } from '@/lib/customer-store';
import { Customer, ChemicalUsage } from '@/types/customer';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import ChemicalLogCard from '@/components/ChemicalLogCard';

const WeeklyReportsPage: React.FC = () => {
  const [weeklyLogs, setWeeklyLogs] = useState<
    Array<{ customer: Customer; usage: ChemicalUsage }>
  >([]);
  const [currentWeekRange, setCurrentWeekRange] = useState('');

  useEffect(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

    setCurrentWeekRange(
      `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`
    );

    const allCustomers = getCustomers();
    const logsForThisWeek: Array<{ customer: Customer; usage: ChemicalUsage }> = [];

    allCustomers.forEach((customer) => {
      customer.chemicalHistory.forEach((usage) => {
        const usageDate = new Date(usage.date);
        if (isWithinInterval(usageDate, { start: weekStart, end: weekEnd })) {
          logsForThisWeek.push({ customer, usage });
        }
      });
    });

    // Sort logs by date, then by customer name
    logsForThisWeek.sort((a, b) => {
      const dateA = new Date(a.usage.date).getTime();
      const dateB = new Date(b.usage.date).getTime();
      if (dateA !== dateB) {
        return dateB - dateA; // Newest first
      }
      return a.customer.name.localeCompare(b.customer.name);
    });

    setWeeklyLogs(logsForThisWeek);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Weekly Chemical Logs</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Week of: {currentWeekRange}</h2>
        <Separator className="mb-4" />
        {weeklyLogs.length === 0 ? (
          <p className="text-muted-foreground">No chemical usage recorded for this week.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyLogs.map((entry, index) => (
              <ChemicalLogCard key={`${entry.customer.id}-${entry.usage.date}-${index}`} usage={entry.usage} customer={entry.customer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyReportsPage;