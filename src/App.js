import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


function App() {


  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [weatherData, setWeatherData] = useState(null);
  const [visitJejuData, setVisitJejuData] = useState(null);

  console.log(weatherData)
  // console.log(visitJejuData)

  useEffect(() => {
    const weatherUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.REACT_APP_WEATHER_KEY}&dataType=JSON&numOfRows=1000&pageNo=1&base_date=20230218&base_time=0630&nx=52&ny=38`;
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

  if (weatherData && weatherData.response) {
    console.log(weatherData.response)
  }
  

  return (
    <>
        <p>{weatherData.response.body.items.item[0].baseDate}</p>
      
    </>
  );
}

export default App;
