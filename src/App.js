import React, { useEffect, useState } from 'react';
import './App.css';

function fetchData() {

  const serviceKey = process.env.REACT_APP_WEATHER_KEY;
  const pageNo = 1;
  const numOfRows = 1000;
  const dataType = 'JSON';
  const base_date = 20230218;
  const base_time = '0500';
  const nx = 52;
  const ny = 38;

  const promise = fetch(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`)
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
  return promise;
}

function App() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);
  
  console.log(data);

  useEffect(() => {
    setIsLoaded(false);

    fetchData()
      .then((data) => {setData(data)})
      .catch((error) => {setError(error)})
      .finally(() => setIsLoaded(true))
  }, [])

  if (error) {return <p>패치 실패</p>}
  if (!isLoaded) {return <p>로딩중....</p>}

  return (
    <>
      <p>{data.response.body.items.item[500].fcstValue}</p>
    </>
  );
}

export default App;
