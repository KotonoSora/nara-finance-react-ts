import GenerateCurrencies from "./GenerateCurrencies";

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  unit: string;
  country: string;
};

const CurrenciesList = ({ currencies }: { currencies: Currency[] }) => {
  if (!Array.isArray(currencies) || currencies.length === 0) {
    return <GenerateCurrencies />;
  }

  return (
    <div>
      <h2>Available Currencies</h2>
      <ul>
        {currencies.map((currency) => (
          <li key={currency.code}>
            {currency.name} ({currency.code})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrenciesList;
