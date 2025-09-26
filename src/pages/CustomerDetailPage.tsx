import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomerById, addChemicalUsageToCustomer } from '@/lib/customer-store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ChemicalLogForm from '@/components/ChemicalLogForm';
import { ChemicalUsage, Customer } from '@/types/customer';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CustomerDetailPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [isLogFormOpen, setIsLogFormOpen] = useState(false);

  useEffect(() => {
    if (customerId) {
      setCustomer(getCustomerById(customerId));
    }
  }, [customerId]);

  const handleLogChemicalUsage = (data: Omit<ChemicalUsage, 'date'> & { date: Date }) => {
    if (customerId) {
      const newUsage: ChemicalUsage = {
        ...data,
        date: format(data.date, 'yyyy-MM-dd'), // Format date to YYYY-MM-DD
      };
      const updatedCustomer = addChemicalUsageToCustomer(customerId, newUsage);
      if (updatedCustomer) {
        setCustomer(updatedCustomer);
        setIsLogFormOpen(false);
        toast.success('Chemical usage logged successfully!');
      } else {
        toast.error('Failed to log chemical usage.');
      }
    }
  };

  if (!customer) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Customer Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">The customer you are looking for does not exist.</p>
        <Link to="/customers">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to="/customers">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{customer.name}</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-2">{customer.address}</p>
      <p className="text-lg text-muted-foreground mb-6">Pool Day: {customer.poolDay}</p>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Chemical Usage History</h2>
        <Dialog open={isLogFormOpen} onOpenChange={setIsLogFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsLogFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Log Usage
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Chemical Usage</DialogTitle>
            </DialogHeader>
            <ChemicalLogForm onSubmit={handleLogChemicalUsage} onCancel={() => setIsLogFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Separator className="mb-4" />

      {customer.chemicalHistory.length === 0 ? (
        <p className="text-muted-foreground">No chemical usage recorded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customer.chemicalHistory.map((usage, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{format(new Date(usage.date), 'PPP')}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Chlorine: {usage.chlorine} ppm</p>
                <p>pH: {usage.ph}</p>
                <p>Alkalinity: {usage.alkalinity} ppm</p>
                <p>Calcium Hardness: {usage.calciumHardness} ppm</p>
                <p>Cyanuric Acid: {usage.cyanuricAcid} ppm</p>
                {usage.notes && <p className="italic mt-2">Notes: {usage.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage;