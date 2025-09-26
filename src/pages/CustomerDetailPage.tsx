import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomerById } from '@/lib/customer-store';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CustomerDetailPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const customer = customerId ? getCustomerById(customerId) : undefined;

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

      <h2 className="text-2xl font-semibold mb-4">Chemical Usage History</h2>
      {/* This section will be populated later with calendar and logging features */}
      <p className="text-muted-foreground">No chemical usage recorded yet.</p>
    </div>
  );
};

export default CustomerDetailPage;