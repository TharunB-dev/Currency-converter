import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './App.css';

const API_URL = "https://api.exchangerate-api.com/v4/latest/"; // we take the api excjhange rate

export default function App() {
  const [amount, setAmount] = useState("1"); // enter the amount value
  const [fromCurrency, setFromCurrency] = useState("USD"); // from  which to rate
  const [toCurrency, setToCurrency] = useState("INR");// to to rate
  const [exchangeRates, setExchangeRates] = useState({}); 
  const [convertedAmount, setConvertedAmount] = useState(null);
  const inputRef = useRef(); //focus on the amount blue colour

  // Fetch exchange rates when fromCurrency changes
  useEffect(() => {
    fetch(`${API_URL}${fromCurrency}`)
      .then((res) => res.json())
      .then((data) => setExchangeRates(data.rates))  //taking rates exchange
      .catch((err) => console.error("Failed to fetch rates", err));
  }, [fromCurrency]);

  // Memoize available currencies
  const availableCurrencies = useMemo(() => Object.keys(exchangeRates), [exchangeRates]);

  // Convert currency
  const convert = useCallback(() => {
    if (exchangeRates[toCurrency]) {
      setConvertedAmount((amount * exchangeRates[toCurrency]).toFixed(2));
    }
  }, [amount, toCurrency, exchangeRates]);

  return (
    <div className="app">
      <h1>Currency Converter</h1>
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          ref={inputRef}
        />
      </div>

      <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
        {availableCurrencies.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>

      <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
        {availableCurrencies.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>

      <button onClick={convert}>Convert</button>

      {convertedAmount !== null && (
        <h2>
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </h2>
      )}
    </div>
  );
}
