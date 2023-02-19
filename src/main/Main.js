import sunImg from './image/henrique-ferreira-CsCNWmtcD8Y-unsplash.jpg'
import rainImg from './image/mike-kotsch-HNx4QLRgy2k-unsplash.jpg'
import bitCloudyImg from './image/maxim-hopman-faUSwwulsrU-unsplash.jpg'
import cloudyImg from './image/nathan-anderson-FAA_bYB7VTg-unsplash.jpg'
import canola from './image/sung-hun-go-JgZ25Bbc9QU-unsplash.jpg'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion, faSun, faCloudRain, faCloudSun, faCloud, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';


export default function Main(props) {
    const weatherData = props.weatherData;
    const visitJejuData = props.visitJejuData;
    
    const filterPTY = weatherData.filter(weatherData => weatherData.fcstTime === '0700' && weatherData.category === 'PTY');
    const filterSKY = weatherData.filter(weatherData => weatherData.fcstTime === '0700' && weatherData.category === 'SKY');
    
    let rain = false;
    
    
    const [inside, setInside] = useState(visitJejuData)
    const [all, setAll] = useState(visitJejuData)
    const [index, setIndex] = useState(0)



    const [mainImg, setMainImg] = useState(null)
    const [mainIcon, setMainIcon] = useState(faQuestion)
    const [mainText, setMainText] = useState(null)

    // 날씨별 출력문구

    useEffect(()=> {
        setInside(() => inside.filter((inside) => {
            return inside.contentscd.label !== '테마여행';
            }).sort(() => Math.random() - 0.5).slice(0, 5)
        );
        setAll(() => all.sort(() => Math.random() - 0.5).slice(0, 5))
        mainSection();
    }, [])

    function mainSection() {
        if (filterPTY[0].fcstValue > 0) {
            rain = true
            setMainImg(rainImg);
            setMainIcon(faCloudRain);
            setMainText('비가 옵니다!');
        } else if (filterSKY[0].fcstValue < 2) {
            rain = false
            setMainImg(sunImg);
            setMainIcon(faSun);
            setMainText('맑음입니다!');

        } else if (1 < filterSKY[0].fcstValue < 4) {
            rain = false
            setMainImg(bitCloudyImg);
            setMainIcon(faCloudSun);
            setMainText('조금 흐립니다!');
        } else if (filterSKY[0].fcstValue > 3) {
            rain = false
            setMainImg(cloudyImg);
            setMainIcon(faCloud);
            setMainText('흐립니다!');
        } else {
            setMainImg(cloudyImg);
            setMainIcon(faCloud);
            setMainText('날씨를 찾을 수 없습니다.');
        }
    }


    console.log(visitJejuData)
    console.log(all)
    console.log(inside)
    console.log(rain)


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
                        <h2 className='font-extralight text-5xl sm:text-6xl lg:text-7xl '>{mainText}</h2>
                </div>
            </div>
            <img
                className='object-cover sm:w-full h-full '
                src = {mainImg}
                alt = 'mainImg'
            />
        </section>

        {/* 하단비주얼1 - 캐러셀 */}
        <section className='lg:px-0 mb-20'>
            <div className='max-w-5xl mx-auto lg:flex lg:items-center'>
                <div className='text-center mb-8 shrink-0 lg:w-48 lg:text-left lg:mb-0'>
                    <h3 className='text-3xl mb-2 text-amber-500 font-medium'>어디를 갈까?</h3>
                    <p className='text-sm'>역시 비 올 때는 실내가 최고지.</p>
                </div>
                <div className='flex relative max-w-5xl px-12 overflow-hidden'>
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

        {/* 하단 비주얼2 :  */}
        <section className='h-80 overflow-hidden flex items-center relative mb-20'>
            <div className='absolute inset-0 bg-black/50 top-0 left-0'>
                <div className='max-w-5xl mx-auto text-white'>
                    <h2>하하하</h2>
                </div>
            </div>
            <img
                className='w-full object-cover'
                src={canola}
            />
        </section>
    </>
    )
}