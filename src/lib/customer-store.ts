import { Customer } from "@/types/customer";

const CUSTOMERS_STORAGE_KEY = "pool_customers";

export const getCustomers = (): Customer[] => {
  if (typeof window === "undefined") return [];
  const customersJson = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  return customersJson ? JSON.parse(customersJson) : [];
};

export const saveCustomers = (customers: Customer[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  }
};

export const addCustomer = (newCustomer: Omit<Customer, 'id' | 'chemicalHistory'>): Customer => {
  const customers = getCustomers();
  const customerWithId: Customer = {
    ...newCustomer,
    id: crypto.randomUUID(), // Generate a unique ID
    chemicalHistory: [],
  };
  customers.push(customerWithId);
  saveCustomers(customers);
  return customerWithId;
};

export const updateCustomer = (updatedCustomer: Customer): void => {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === updatedCustomer.id);
  if (index !== -1) {
    customers[index] = updatedCustomer;
    saveCustomers(customers);
  }
};

export const deleteCustomer = (customerId: string): void => {
  const customers = getCustomers();
  const filteredCustomers = customers.filter((c) => c.id !== customerId);
  saveCustomers(filteredCustomers);
};

export const getCustomerById = (customerId: string): Customer | undefined => {
  const customers = getCustomers();
  return customers.find((c) => c.id === customerId);
};