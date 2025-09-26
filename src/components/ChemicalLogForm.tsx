"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  chlorine: z.coerce.number().min(0, { message: 'Chlorine must be a positive number.' }),
  ph: z.coerce.number().min(0, { message: 'pH must be a positive number.' }),
  alkalinity: z.coerce.number().min(0, { message: 'Alkalinity must be a positive number.' }),
  calciumHardness: z.coerce.number().min(0, { message: 'Calcium Hardness must be a positive number.' }),
  cyanuricAcid: z.coerce.number().min(0, { message: 'Cyanuric Acid must be a positive number.' }),
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
    defaultValues: initialData || {
      date: new Date(),
      chlorine: 0,
      ph: 0,
      alkalinity: 0,
      calciumHardness: 0,
      cyanuricAcid: 0,
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
              <FormLabel>Chlorine (ppm)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="e.g., 3.0" {...field} />
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
              <FormLabel>pH</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="e.g., 7.4" {...field} />
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
              <FormLabel>Alkalinity (ppm)</FormLabel>
              <FormControl>
                <Input type="number" step="1" placeholder="e.g., 100" {...field} />
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
              <FormLabel>Calcium Hardness (ppm)</FormLabel>
              <FormControl>
                <Input type="number" step="1" placeholder="e.g., 250" {...field} />
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
              <FormLabel>Cyanuric Acid (ppm)</FormLabel>
              <FormControl>
                <Input type="number" step="1" placeholder="e.g., 40" {...field} />
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
              <FormLabel>Notes for this log</FormLabel>
              <FormControl>
                <Textarea placeholder="Any specific observations or actions taken..." {...field} />
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