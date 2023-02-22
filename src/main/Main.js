import sunImg from './image/henrique-ferreira-CsCNWmtcD8Y-unsplash.jpg';
import rainImg from './image/mike-kotsch-HNx4QLRgy2k-unsplash.jpg';
import bitCloudyImg from './image/maxim-hopman-faUSwwulsrU-unsplash.jpg';
import cloudyImg from './image/nathan-anderson-FAA_bYB7VTg-unsplash.jpg';
import canola from './image/sung-hun-go-JgZ25Bbc9QU-unsplash.jpg';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion, faSun, faCloudRain, faCloudSun, faCloud, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';


export default function Main(props) {
    const weatherData = props.weatherData;
    const visitJejuData = props.visitJejuData;
    
    const date = new Date();
    const nowDate = date.getFullYear().toString() + '0' + (date.getMonth()+1).toString() + date.getDate().toString();
    let rain = false;
    
    const [mainImg, setMainImg] = useState(sunImg);
    const [mainIcon, setMainIcon] = useState(faQuestion);
    const [mainText, setMainText] = useState('날씨를 찾을 수 없습니다.');

    // 현재 날씨 세팅
    function nowWeatherSetting() {
        const hours = date.getHours();
        let time;

        {time < 10 ? time = '0'+hours+'00' : time = hours+'00'};

        const filterPTY = weatherData.filter(weatherData => weatherData.fcstDate === nowDate && weatherData.fcstTime === time && weatherData.category === 'PTY')[0].fcstValue;
        const filterSKY = weatherData.filter(weatherData => weatherData.fcstDate === nowDate && weatherData.fcstTime === time && weatherData.category === 'SKY')[0].fcstValue;

        if (filterPTY > 0) {
            rain = true;
            setMainImg(rainImg);
            setMainIcon(faCloudRain);
            setMainText('비가 내립니다!');
        } else if (filterSKY < 2) {
            rain = false;
            setMainImg(sunImg);
            setMainIcon(faSun);
            setMainText('화창한 맑음입니다!');

        } else if (1 < filterSKY < 4) {
            rain = false;
            setMainImg(bitCloudyImg);
            setMainIcon(faCloudSun);
            setMainText('조금 흐립니다!');
        } else if (filterSKY > 3) {
            rain = false;
            setMainImg(cloudyImg);
            setMainIcon(faCloud);
            setMainText('흐린 날씨입니다!');
        }
    }

    useEffect(()=> {
        nowWeatherSetting();
    }, [])


    // 오늘의 최저/최고 기온/강수량
    function weatherForecast(items) {
        let filterWeather = weatherData.filter(weatherData =>weatherData.fcstDate === nowDate && weatherData.category === items);
        return filterWeather[0].fcstValue;
    }

    
    let timeArr = [];
    // 현재 시각과 비슷한 시각 5개 추리기
    hours();
    function hours() {
        const overTime = [];
        const hours = date.getHours();

        for (let i=0; i<5; i++) {hours+i < 24 ? timeArr.push(hours+i) : overTime.push(i)};
        for (let i=0; i<=overTime.length; i++) timeArr.push((hours-1)-i);
        timeArr.sort((a,b)=>{return a-b});
    }

    // 시간대별 날씨 세팅
    function HourlyWeather(index) {
        let timeSting = [];

        timeArr.map((time)=>{
            if (time < 10) {
                return timeSting.push('0'+time+'00')
            } else {
                return timeSting.push(time+'00')
            }
        });

        const filterPTY = weatherData.filter(weatherData => weatherData.fcstDate === nowDate && weatherData.fcstTime === timeSting[index] && weatherData.category === 'PTY')[0].fcstValue;
        const filterSKY = weatherData.filter(weatherData => weatherData.fcstDate === nowDate && weatherData.fcstTime === timeSting[index] && weatherData.category === 'SKY')[0].fcstValue;

        this.index = index;
        this.setTime = timeArr[index];
        this.setIcon = function () {
            if (filterPTY > 0) {
                return faCloudRain;
            } else if (filterSKY < 2) {
                return faSun;
            } else if (1 < filterSKY < 4) {
                return faCloudSun;
            } else if (filterSKY > 3) {
                return faCloud;
            } else {
                return faQuestion;
            }
        }
        this.setWeather = function () {
            if (filterPTY > 0) {
                return '비';
            } else if (filterSKY < 2) {
                return '맑은';
            } else if (1 < filterSKY < 4) {
                return '조금 흐림';
            } else if (filterSKY > 3) {
                return '흐림';
            } else {
                return '알 수 없음';
            }
        }
    }

    return(
    <>
        {/* 메인비주얼 */}
        <section 
            className='w-full overflow-hidden relative mb-20'
            style={{height: '740px'}}
        >
            <div className='absolute top-0 left-0 flex w-full h-full items-center text-white'>
                <div className='max-w-5xl mx-auto w-full relative max-lg:px-8'>
                        <FontAwesomeIcon
                            className='animate-bounce mb-4 absolute -top-14'
                            size='3x'
                            icon={mainIcon}
                        />
                        <h2 className='mb-2 font-medium text-2xl sm:text-3xl lg:text-4xl' >오늘의 제주는</h2>
                        <h2 className='mb-8 font-extralight text-5xl sm:text-6xl lg:text-7xl '>{mainText}</h2>
                        <p className='text-lg'>오늘의 기온은 최저 {weatherForecast('TMN')}℃, 최고 {weatherForecast('TMX')}℃로, 강수 확률은 {weatherForecast('POP')}% 입니다.</p>
                </div>
            </div>
            <div className='absolute bottom-0 text-white p-6 bg-black/70 w-full'>
                <div className='max-w-5xl mx-auto flex justify-center justify-between'>
                    {timeArr.map((time, i) => (
                        <div
                            key={'div'+i}
                            className={`flex flex-col items-center ${date.getHours() === time ? 'opacity-90' : 'opacity-50'}`}
                        >
                            <FontAwesomeIcon
                                key={'icon'+i}
                                className='mb-2'
                                size='2xl'
                                icon={new HourlyWeather(i).setIcon()}
                            />
                            <p className='text-xs font-bold' key={'text'+i}>{new HourlyWeather(i).setWeather()}</p>
                            <p className='text-xs font-bold' key={'time'+i}>{new HourlyWeather(i).setTime}시</p>
                        </div>
                    ))}
                </div>
            </div>
            <img
                className='object-cover sm:w-full h-full '
                src = {mainImg}
                alt = 'mainImg'
            />
        </section>

        {/* 하단비주얼1 - 캐러셀 */}
        <Carousel
            visitJejuData = {visitJejuData}
            rain = {rain}
        />
        
        {/* 하단 비주얼2 : 키워드 */}
        <Keyword
            visitJejuData = {visitJejuData}
        />
    </>
    )
}

// 하단비주얼1 - 캐러셀
function Carousel(props) {
    const visitJejuData = props.visitJejuData;
    const rain = props.rain;

    const [index, setIndex] = useState(0);
    const [inside, setInside] = useState(visitJejuData);
    const [all, setAll] = useState(visitJejuData);

    useEffect(()=> {
        setInside(() => inside.filter((inside) => {
            return inside.contentscd.label !== '테마여행';
            }).sort(() => Math.random() - 0.5).slice(0, 5)
        );
        setAll(() => all.sort(() => Math.random() - 0.5).slice(0, 5))
    }, [])

    return (
        <section className='lg:px-0 mb-20'>
            <div className='max-w-5xl mx-auto lg:flex lg:items-center'>
                <div className='text-center mb-8 shrink-0 lg:w-48 lg:text-left lg:mb-0'>
                    <h3 className='text-3xl mb-2 text-amber-500 font-medium'>어디를 갈까?</h3>
                    <p className='text-sm'>{rain ? '역시 비 올 때는 실내가 최고지.' : '어디든지 가는거야!'}</p>
                </div>
                <div className='flex relative px-12 overflow-hidden'>
                    {index === 0 ? null :
                    <div className='absolute top-0 left-8 h-full w-6 bg-gradient-to-r from-white z-10'>
                        <div className='absolute top-0 -left-8 h-full w-8 bg-white'></div>
                        <button
                            onClick={() => setIndex(index+1)}
                            className='absolute top-1/2 -left-6'
                        >
                            <FontAwesomeIcon
                                size='2xl'
                                icon={faChevronLeft}
                                color='#fbbf24'
                            />
                        </button>
                    </div>
                    }
                    {index === -2 ? null :
                    <div className='absolute top-0 right-10 h-full w-6 bg-gradient-to-l from-white z-10'>
                        <div className='absolute top-0 -right-12 h-full w-12 bg-white'></div>
                        <button
                            onClick={() => setIndex(index-1)}
                            className='absolute top-1/2 -right-10'
                        >
                            <FontAwesomeIcon
                                size='2xl'
                                icon={faChevronRight}
                                color='#fbbf24'
                            />
                        </button>
                    </div>
                    }
                    {(rain ? inside : all).map((shuffles, i) => (
                        <div
                            key={'imgDiv'+i}
                            className='w-60 h-80 overflow-hidden mr-3 shrink-0 relative duration-300 group/card'
                            style={{transform: `translateX(${255*index}px)`}}
                        >
                            <img
                                className='h-full w-full object-cover'
                                key={shuffles.repPhoto.photoid.photoid}
                                src={shuffles.repPhoto.photoid.imgpath}

                            />
                            <div className='absolute inset-0 p-6 bg-black/50 text-white text-center flex flex-col items-center justify-center translate-y-80 group-hover/card:translate-y-0 duration-300'>
                                <h4 className='text-2xl mb-2'>{shuffles.title}</h4>
                                <p className='text-sm inline-block font-semibold mb-8 px-2 py-1 text-amber-400 border border-amber-400 rounded-full'>{shuffles.contentscd.label}</p>
                                <p className='text-xs'>{shuffles.address}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// 하단 비주얼2 : 키워드
function Keyword(props) {
    const visitJejuData = props.visitJejuData
    // const filterTag = weatherData.filter(weatherData => weatherData.fcstDate === nowDate && weatherData.fcstTime === timeSting[index] && weatherData.category === 'PTY')[0].fcstValue;
    console.log(visitJejuData)
    return (
        <section className='h-80 overflow-hidden flex items-center relative mb-20'>
            <div className='absolute inset-0 bg-black/50 top-0 left-0'>
                <div className='max-w-5xl mx-auto text-white'>
                    <h2>어떤게 끌려?</h2>
                    <div>
                        <ul>
                            <li></li>
                        </ul>
                    </div>
                </div>
            </div>
            <img
                className='w-full object-cover'
                src={canola}
            />
        </section>
    )
}