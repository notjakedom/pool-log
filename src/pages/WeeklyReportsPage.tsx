"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getCustomers } from '@/lib/customer-store';
import { Customer, ChemicalUsage } from '@/types/customer';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChemicalNotesDisplay from '@/components/ChemicalNotesDisplay';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { usePdfGenerator } from '@/hooks/use-pdf-generator'; // Import the new hook

type PoolDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

interface CustomerWeeklyLog {
  customer: Customer;
  usages: ChemicalUsage[];
}

interface DayReport {
  day: PoolDay;
  customers: CustomerWeeklyLog[];
}

const WeeklyReportsPage: React.FC = () => {
  const [weeklyReportData, setWeeklyReportData] = useState<DayReport[]>([]);
  const [currentWeekRange, setCurrentWeekRange] = useState('');
  const reportRef = useRef<HTMLDivElement>(null); // Ref for the content to be captured
  const { generatePdf } = usePdfGenerator(); // Use the PDF generator hook

  useEffect(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

    setCurrentWeekRange(
      `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`
    );

    const allCustomers = getCustomers();
    const daysOfWeek: PoolDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const reportMap: Record<PoolDay, CustomerWeeklyLog[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };

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
        reportMap[customer.poolDay].push({ customer, usages: customerWeeklyUsages });
      }
    });

    // Sort customers within each day by name
    daysOfWeek.forEach(day => {
      reportMap[day].sort((a, b) => a.customer.name.localeCompare(b.customer.name));
    });

    const formattedReportData: DayReport[] = daysOfWeek.map(day => ({
      day,
      customers: reportMap[day],
    }));

    setWeeklyReportData(formattedReportData);
  }, []);

  const handleDownloadPdf = () => {
    generatePdf(reportRef.current, `Weekly_Chemical_Report_${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const hasAnyLogs = weeklyReportData.some(dayReport => dayReport.customers.length > 0);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Weekly Chemical Reports</h1>
        <Button onClick={handleDownloadPdf}>
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>

      <div ref={reportRef} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"> {/* Content to be captured */}
        <h2 className="text-xl font-semibold mb-3">Week of: {currentWeekRange}</h2>
        <Separator className="mb-4" />
        {!hasAnyLogs ? (
          <p className="text-muted-foreground">No chemical usage recorded for this week across all customers.</p>
        ) : (
          <div className="space-y-8">
            {weeklyReportData.map((dayReport) => (
              <div key={dayReport.day}>
                <h3 className="text-2xl font-bold mb-4">{dayReport.day}</h3>
                <Separator className="mb-4" />
                {dayReport.customers.length === 0 ? (
                  <p className="text-muted-foreground mb-6">No customers with logs for {dayReport.day} this week.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {dayReport.customers.map(({ customer, usages }) => (
                      <Card key={customer.id} className="w-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            <Link to={`/customer/${customer.id}`} className="hover:underline">
                              {customer.name}
                            </Link>
                            <span className="text-sm text-muted-foreground ml-2">({customer.address})</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {usages.map((usage, index) => (
                            <div key={`${customer.id}-${usage.date}-${index}`} className="border-t pt-4 first:border-t-0 first:pt-0">
                              <p className="font-medium text-sm mb-2">{format(new Date(usage.date), 'PPP')}</p>
                              <ChemicalNotesDisplay usage={usage} />
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyReportsPage;