"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-xl">Pool Logbook</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link to="/customers">
                <Button variant="ghost">Customer Logbook</Button>
              </Link>
              <Link to="/daily-logs">
                <Button variant="ghost">Daily Logs</Button>
              </Link>
              <Link to="/weekly-reports"> {/* New link */}
                <Button variant="ghost">Weekly Reports</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;