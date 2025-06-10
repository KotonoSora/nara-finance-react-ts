import { Button } from "~/components/ui/button";

const GenerateCurrencies = () => {
  const handleGenerate = async () => {
    try {
      const response = await fetch("/api/currencies/seed", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate currencies");
      }
    } catch (error) {
      console.error("Error generating currencies:", error);
    }
  };

  return (
    <Button className="cursor-pointer" onClick={handleGenerate}>
      Generate Currencies
    </Button>
  );
};

export default GenerateCurrencies;
