"use client";

import React from 'react';
import { Customer } from '@/types/customer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
import DeleteCustomerDialog from './DeleteCustomerDialog';
import { Link } from 'react-router-dom';

interface CustomerCardProps {
  customer: Customer;
  onDelete: (id: string) => void;
  onEdit: (customer: Customer) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onDelete, onEdit }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <Link to={`/customer/${customer.id}?openLog=true`} className="hover:underline">
            {customer.name}
          </Link>
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(customer)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteCustomerDialog
            customerName={customer.name}
            onConfirm={() => onDelete(customer.id)}
          >
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </DeleteCustomerDialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Removed address, pool day, and latest chemical log details for a streamlined view */}
      </CardContent>
    </Card>
  );
};

export default CustomerCard;