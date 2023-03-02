import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Header from './main/Header';
import Footer from './main/Footer';
import MainContent from './main/MainContent';
import Theme from './sub/Theme';
import Detail from './sub/Detail';
import KakaoMap from './sub/KakaoMap';


function App() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [weatherData, setWeatherData] = useState(null);
  const [visitJejuData, setVisitJejuData] = useState(null);
  
  const [nowWeather, setNowWeather] = useState(null)
  const [tags, setTags] = useState([])

  const date = new Date();
  let yesterday;
  let today;
  
  // 어제/오늘 일자
  function getDays() {
    if (date.getDate() === 1 && date.getMonth() < 10) {
      const year = date.getFullYear().toString();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);

      const _prevMonth = new Date(date.getFullYear(), date.getMonth()-1, 1)
      const _prevDay = new Date(date.getFullYear(), date.getMonth(), 0)
      const prevMonth = ("0" + (_prevMonth.getMonth() + 1)).slice(-2);
      const prevDay = ('0' + _prevDay.getDate()).slice(-2);

      yesterday = (year + prevMonth + prevDay);
      today = (year + month + day);
    }
    if (date.getDate() > 1) {
      const year = date.getFullYear().toString();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const prevDay = ('0' + (date.getDate() - 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      
      yesterday = (year + month + prevDay);
      today = (year + month + day);
    }
  }
  getDays()

  
  useEffect(() => {
    const weatherUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.REACT_APP_WEATHER_KEY}&dataType=JSON&numOfRows=1000&pageNo=1&base_date=${yesterday}&base_time=0500&nx=52&ny=38`;
    const visitJejuUrl = `http://api.visitjeju.net/vsjApi/contents/searchList?apiKey=${process.env.REACT_APP_VISITJEJU_KEY}&locale=kr`;

    axios.get(weatherUrl)
      .then(response => {
        setWeatherData(response.data);
        nowWeatherSetting(response.data);
      })
      .catch(error => {
        console.log(error);
      });

    axios.get(visitJejuUrl)
      .then(response => {
        setVisitJejuData(response.data);
        tagFliter(response.data)
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


  // 현재 날씨
  function nowWeatherSetting(data) {
    const _weatherData = data.response.body.items.item;
    const hours = date.getHours();
    let time;

    {time < 10 ? time = '0'+hours+'00' : time = hours+'00'};

    const filterPTY = _weatherData.filter(_weatherData => _weatherData.fcstDate === today && _weatherData.fcstTime === time && _weatherData.category === 'PTY')[0].fcstValue;
    const filterSKY = _weatherData.filter(_weatherData => _weatherData.fcstDate === today && _weatherData.fcstTime === time && _weatherData.category === 'SKY')[0].fcstValue;

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

  // 태그 모음
  function tagFliter(data) {
      const _visitJejuData = data.items
      const filterTag = _visitJejuData.filter((_visitJejuData) => _visitJejuData.repPhoto !== null);
      const label = Array.from(new Set(filterTag.map(filterTag => filterTag.contentscd.label)));

      label.unshift('전체');
      setTags(label);
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
                tags = {tags}
                today = {today}
              />
          }/>
          <Route path='theme' element={
            visitJejuData &&
            <Theme
              visitJejuData = {visitJejuData.items}
              tags = {tags}
            />
          }/>
          <Route path='theme/:id' element={<Detail />} />
          {weatherData &&
            <Route path='kakaomap' element={
              <KakaoMap
              visitJejuData = {visitJejuData.items}
              nowWeather = {nowWeather}
              tags = {tags}
              today = {today}
              />
            } />
          }
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
