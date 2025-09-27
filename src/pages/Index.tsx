import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Pool Logbook App</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Manage your customers' pool chemical usage with ease.
        </p>
        <div className="flex flex-col space-y-4">
          <Link to="/customers">
            <Button size="lg" className="text-lg px-8 py-4 w-full">Go to Customer Logbook</Button>
          </Link>
          <Link to="/daily-logs">
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 w-full">View Daily Logs</Button>
          </Link>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;