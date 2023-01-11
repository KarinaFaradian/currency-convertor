import React, {useState, useEffect, useRef} from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('RUB');
  const [toCurrency, setToCurrency] = useState('USD')
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);

  const quotesRef = useRef({});

  let myHeaders = new Headers();
  myHeaders.append("apikey", "xSNNRQsH3VIAzvRebTOrjd1cnIA6MeG3");

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };
  
  useEffect(() => {
    fetch("https://api.apilayer.com/currency_data/live?source=JPY&currencies=EUR%2CRUB%2CUSD%2CGBP", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      quotesRef.current = json.quotes;
      onChangeToPrice(1);
    }).catch(err => {
      console.warn(err);
      alert('Error');
    })
  }, []);

  const onChangeFromPrice = (value) => {
    const price = value / quotesRef.current[`JPY${fromCurrency}`];
    const result = price * quotesRef.current[`JPY${toCurrency}`];
    setFromPrice(value);
    setToPrice(result.toFixed(3));
  }

  const onChangeToPrice = (value) => {
    const result = (quotesRef.current[`JPY${fromCurrency}`] / quotesRef.current[`JPY${toCurrency}`]) * value;
    setFromPrice(result.toFixed(3));
    setToPrice(value);
  }

  useEffect(() => {
    onChangeFromPrice(fromPrice);
  },[fromCurrency])

  useEffect(() => {
    onChangeToPrice(toPrice);
  },[toCurrency])

  return (
    <div className="App">
      <Block 
        value={fromPrice} 
        currency={fromCurrency} 
        onChangeCurrency={setFromCurrency} 
        onChangeValue={onChangeFromPrice} 
      />
      <Block 
        value={toPrice} 
        currency={toCurrency} 
        onChangeCurrency={setToCurrency} 
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
