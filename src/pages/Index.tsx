import { MadeWithDyad } from "@/components/made-with-dyad";
// Removed Link and Button imports as navigation is now in Layout

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Dominick Pool Solutions</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Manage your customers' pool chemical usage with ease. Use the navigation above to get started.
        </p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;