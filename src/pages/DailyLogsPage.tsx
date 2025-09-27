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
import { format, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import ChemicalLogCard from '@/components/ChemicalLogCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DailyLogsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dailyLogs, setDailyLogs] = useState<
    Array<{ customer: Customer; usage: ChemicalUsage }>
  >([]);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [activeDayTab, setActiveDayTab] = useState<string>(daysOfWeek[0]);

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

      // Set active tab to the selected date's day of the week
      const dayIndex = getDay(selectedDate); // 0 for Sunday, 1 for Monday, etc.
      if (dayIndex >= 1 && dayIndex <= 5) { // Monday (1) to Friday (5)
        setActiveDayTab(daysOfWeek[dayIndex - 1]);
      } else {
        setActiveDayTab(daysOfWeek[0]); // Default to Monday if weekend or invalid
      }

    } else {
      setDailyLogs([]);
      setActiveDayTab(daysOfWeek[0]); // Default to Monday if no date selected
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

          <Tabs value={activeDayTab} onValueChange={setActiveDayTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {daysOfWeek.map((day) => (
                <TabsTrigger key={day} value={day}>
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>
            {daysOfWeek.map((day) => (
              <TabsContent key={day} value={day} className="mt-6">
                <div className="grid grid-cols-1 gap-4">
                  {dailyLogs
                    .filter((entry) => entry.customer.poolDay === day)
                    .map((entry, index) => (
                      <ChemicalLogCard key={index} usage={entry.usage} customer={entry.customer} />
                    ))}
                  {dailyLogs.filter((entry) => entry.customer.poolDay === day).length === 0 && (
                    <p className="text-muted-foreground col-span-full">No chemical usage recorded for {day} on this date.</p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DailyLogsPage;