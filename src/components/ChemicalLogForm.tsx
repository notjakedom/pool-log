"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChemicalUsage } from '@/types/customer';

const chemicalLogSchema = z.object({
  date: z.date({
    required_error: "A date for the chemical log is required.",
  }),
  chlorine: z.string().optional(),
  ph: z.string().optional(),
  alkalinity: z.string().optional(),
  calciumHardness: z.string().optional(),
  cyanuricAcid: z.string().optional(),
  notes: z.string().optional(),
});

type ChemicalLogFormValues = z.infer<typeof chemicalLogSchema>;

interface ChemicalLogFormProps {
  initialData?: Omit<ChemicalUsage, 'date'> & { date: Date };
  onSubmit: (data: ChemicalLogFormValues) => void;
  onCancel?: () => void;
}

const ChemicalLogForm: React.FC<ChemicalLogFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const form = useForm<ChemicalLogFormValues>({
    resolver: zodResolver(chemicalLogSchema),
    defaultValues: initialData ? {
      date: initialData.date,
      chlorine: initialData.chlorine || '',
      ph: initialData.ph || '',
      alkalinity: initialData.alkalinity || '',
      calciumHardness: initialData.calciumHardness || '',
      cyanuricAcid: initialData.cyanuricAcid || '',
      notes: initialData.notes || '',
    } : {
      date: new Date(),
      chlorine: '',
      ph: '',
      alkalinity: '',
      calciumHardness: '',
      cyanuricAcid: '',
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chlorine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chlorine Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Added 2 tabs, levels good" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ph"
          render={({ field }) => (
            <FormItem>
              <FormLabel>pH Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Slightly high, added acid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alkalinity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alkalinity Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Stable, no adjustment needed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="calciumHardness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calcium Hardness Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Within range" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cyanuricAcid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cyanuric Acid Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Checked, looks good" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>General Log Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any overall observations or actions taken..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            Save Log
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChemicalLogForm;