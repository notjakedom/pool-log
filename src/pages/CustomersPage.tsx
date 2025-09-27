import React, { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { addCustomer, deleteCustomer, getCustomers, updateCustomer } from '@/lib/customer-store';
import CustomerCard from '@/components/CustomerCard';
import CustomerForm from '@/components/CustomerForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [activeDayTab, setActiveDayTab] = useState<string>(daysOfWeek[0]); // State for active tab

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const handleAddCustomer = (data: Omit<Customer, 'id' | 'chemicalHistory'>) => {
    const newCustomer = addCustomer(data);
    setCustomers((prev) => [...prev, newCustomer]);
    setIsFormOpen(false);
    toast.success(`Customer "${newCustomer.name}" added successfully.`);
    // If the new customer's poolDay is not the active tab, switch to it
    if (newCustomer.poolDay !== activeDayTab) {
      setActiveDayTab(newCustomer.poolDay);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    toast.info('Customer deleted.');
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleUpdateCustomer = (data: Omit<Customer, 'id' | 'chemicalHistory'>) => {
    if (editingCustomer) {
      const updatedCustomer: Customer = { ...editingCustomer, ...data };
      updateCustomer(updatedCustomer);
      setCustomers((prev) =>
        prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
      );
      setEditingCustomer(null);
      setIsFormOpen(false);
      toast.success(`Customer "${updatedCustomer.name}" updated successfully.`);
      // If the updated customer's poolDay is not the active tab, switch to it
      if (updatedCustomer.poolDay !== activeDayTab) {
        setActiveDayTab(updatedCustomer.poolDay);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Logbook</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCustomer(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            </DialogHeader>
            <CustomerForm
              initialData={editingCustomer ? { name: editingCustomer.name, address: editingCustomer.address, poolDay: editingCustomer.poolDay } : undefined}
              onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
              onCancel={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers
                .filter((customer) => customer.poolDay === day)
                .map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onDelete={handleDeleteCustomer}
                    onEdit={handleEditCustomer}
                  />
                ))}
              {customers.filter((customer) => customer.poolDay === day).length === 0 && (
                <p className="text-muted-foreground col-span-full">No customers scheduled for {day}.</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CustomersPage;