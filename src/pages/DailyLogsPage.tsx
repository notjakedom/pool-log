"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '@/lib/customer-store';
import { Customer, ChemicalUsage } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import ChemicalLogCard from '@/components/ChemicalLogCard';

const DailyLogsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dailyLogs, setDailyLogs] = useState<
    Array<{ customer: Customer; usage: ChemicalUsage }>
  >([]);

  useEffect(() => {
    if (selectedDate) {
      const allCustomers = getCustomers();
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');

      const logsForSelectedDate: Array<{ customer: Customer; usage: ChemicalUsage }> = [];
      allCustomers.forEach((customer) => {
        customer.chemicalHistory.forEach((usage) => {
          if (usage.date === formattedDate) {
            logsForSelectedDate.push({ customer, usage });
          }
        });
      });
      setDailyLogs(logsForSelectedDate);
    } else {
      setDailyLogs([]);
    }
  }, [selectedDate]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Daily Chemical Logs</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <h2 className="text-xl font-semibold mb-3">Select a Date</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="md:w-2/3">
          <h2 className="text-xl font-semibold mb-3">
            Logs for {selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}
          </h2>
          <Separator className="mb-4" />
          {dailyLogs.length === 0 ? (
            <p className="text-muted-foreground">No chemical usage recorded for this date.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {dailyLogs.map((entry, index) => (
                <ChemicalLogCard key={index} usage={entry.usage} customer={entry.customer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyLogsPage;