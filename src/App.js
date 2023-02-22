import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from './main/Header';
import Main from './main/Main';


function App() {

  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [weatherData, setWeatherData] = useState(null);
  const [visitJejuData, setVisitJejuData] = useState(null);
  
  const date = new Date()
  const nowDate = date.getFullYear().toString() + '0' + (date.getMonth()+1).toString() + (date.getDate()-1).toString()


  useEffect(() => {
    const weatherUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.REACT_APP_WEATHER_KEY}&dataType=JSON&numOfRows=1000&pageNo=1&base_date=${nowDate}&base_time=0500&nx=52&ny=38`;
    const visitJejuUrl = `http://api.visitjeju.net/vsjApi/contents/searchList?apiKey=${process.env.REACT_APP_VISITJEJU_KEY}&locale=kr`;

    axios.get(weatherUrl)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.log(error);
      });

    axios.get(visitJejuUrl)
      .then(response => {
        setVisitJejuData(response.data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  if (error) {
    return <p>failed to fetch</p>
  }

  if (!isLoaded) {
    return <p>fetching data...</p>
  }

  return (
    <>
      <Header
      />
      {weatherData ?
      <Main
        weatherData = {weatherData.response.body.items.item}
        visitJejuData = {visitJejuData.items}
      />
      :
      console.log('로딩중...')
    }
    </>
  );
}

export default App;
