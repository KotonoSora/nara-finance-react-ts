import type { Currency } from "~/features/finance/domain/types/DataContracts";

import GenerateCurrencies from "./GenerateCurrencies";

interface CurrenciesListProps {
  currencies: Currency[];
}

const CurrenciesList = ({ currencies }: CurrenciesListProps) => {
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
