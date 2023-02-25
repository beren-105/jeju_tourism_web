import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Header from './main/Header';
import Footer from './main/Footer';
import MainContent from './main/MainContent';
import Theme from './sub/Theme';


function App() {

  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [weatherData, setWeatherData] = useState(null);
  const [visitJejuData, setVisitJejuData] = useState(null);
  
  const date = new Date()
  const yesterday = date.getFullYear().toString() + '0' + (date.getMonth()+1).toString() + (date.getDate()-1).toString()

  const [nowWeather, setNowWeather] = useState(null)


  useEffect(() => {
    const weatherUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.REACT_APP_WEATHER_KEY}&dataType=JSON&numOfRows=1000&pageNo=1&base_date=${yesterday}&base_time=0500&nx=52&ny=38`;
    const visitJejuUrl = `http://api.visitjeju.net/vsjApi/contents/searchList?apiKey=${process.env.REACT_APP_VISITJEJU_KEY}&locale=kr`;

    axios.get(weatherUrl)
      .then(response => {
        setWeatherData(response.data);
        nowWeatherSetting(response.data)
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

  function nowWeatherSetting(data) {
    const nowDate = date.getFullYear().toString() + '0' + (date.getMonth()+1).toString() + date.getDate().toString();
    const _weatherData = data.response.body.items.item
    const hours = date.getHours();
    let time;

    {time < 10 ? time = '0'+hours+'00' : time = hours+'00'};

    const filterPTY = _weatherData.filter(_weatherData => _weatherData.fcstDate === nowDate && _weatherData.fcstTime === time && _weatherData.category === 'PTY')[0].fcstValue;
    const filterSKY = _weatherData.filter(_weatherData => _weatherData.fcstDate === nowDate && _weatherData.fcstTime === time && _weatherData.category === 'SKY')[0].fcstValue;
    console.log(time)
    console.log(filterPTY)
    console.log(filterSKY)
    if (filterPTY > 0) {
      setNowWeather('비');
    } else if (2 < filterPTY && filterPTY < 4) {
      setNowWeather('눈');
    } else if (3 < filterPTY) {
      setNowWeather('소나기')
    } else if (filterSKY < 2) {
      setNowWeather('맑음');
    } else if (1 < filterSKY && filterSKY < 4) {
      setNowWeather('조금 흐림');
    } else if (filterSKY > 3) {
      setNowWeather('흐림');
    }
  }

  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={
            weatherData &&
              <MainContent
                weatherData = {weatherData.response.body.items.item}
                visitJejuData = {visitJejuData.items}
                nowWeather = {nowWeather}
              />
          }/>
          <Route path='theme' element={
            visitJejuData &&
            <Theme visitJejuData = {visitJejuData.items} />
          }/>
        </Route>
      </Routes>
    </Router>
  );
}

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default App;
