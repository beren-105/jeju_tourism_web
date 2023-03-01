import {Map, MapMarker, MapInfoWindow, Roadview, RoadviewMarker } from 'react-kakao-maps-sdk';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faQuestion,
    faSun,
    faCloudRain,
    faCloudSun,
    faCloud,
    faSnowflake,
    faUtensils
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';

// https://react-kakao-maps-sdk.jaeseokim.dev/docs/sample/overlay/categoryMarker

export default function KakaoMap(props) {
    const visitJejuData = props.visitJejuData;
    const today = props.today;
    const tags = props.tags;

    const [weatherIcon, setWeatherIcon] = useState(faQuestion)

    function weatherSetting() {
        switch (props.nowWeather) {
            case '비' :
                setWeatherIcon(faCloudRain);
                break;
            case '소나기' :
                setWeatherIcon(faCloudRain);
                break;
            case '눈' : 
                setWeatherIcon(faSnowflake);
            case '맑음' :
                setWeatherIcon(faSun);
                break;
            case '조금 흐림' : 
                setWeatherIcon(faCloudSun);
                break;
            case '흐림' :
                setWeatherIcon(faCloud);
                break;
        }
    }

    
    const [inputs, setInputs] = useState('');
    const [inputContent, setInputConetne] = useState(true);

    const all = visitJejuData.filter(data => !!data.latitude && !!data.longitude);
    const [localDatas, setLocalDatas] = useState(all);

    useEffect(()=> {
        weatherSetting();
    }, [])

    function hendleSubmit(e) {
        e.preventDefault();
        if (inputs.trim() === '') {
            setInputConetne(false);
            setLocalDatas(all)
        } else {
            setInputConetne(true);

            const filterData =  visitJejuData.filter(visitJejuData => {
                return !!visitJejuData.alltag && visitJejuData.alltag.includes(inputs) ||
                !!visitJejuData.address && visitJejuData.address.includes(inputs) ||
                !!visitJejuData.title && visitJejuData.title.includes(inputs) ||
                !!visitJejuData.label && visitJejuData.label.includes(inputs)
            })
            setLocalDatas(filterData)
            console.log(filterData)
        }
    }


    return(
        <>
        <section className='relative h-full bg-white'>
            <div className='absolute px-4 top-0 left-0 w-80 h-full bg-white z-40'>
                <form
                    className='py-6 flex'
                    onSubmit={(e) => hendleSubmit(e)}
                >
                    <input
                        className='border-2 border-r-0 rounded-l p-2 w-full'
                        type='text'
                        value={inputs}
                        onChange={(e) => setInputs(e.target.value)}
                    />
                    <button
                        className='px-4 shrink-0 bg-amber-500 text-white rounded-r hover:bg-amber-300 duration-300'
                        type='submit'
                    >
                        검색
                    </button>
                </form>
                <article>
                    <h4>오늘의 날씨</h4>
                    <p>{props.nowWeather}</p>
                    <FontAwesomeIcon
                        icon={weatherIcon}
                    />
                </article>
            </div>
            <Map
                center={{ lat: 33.41667, lng: 126.50000 }}
                style={{ width: "100%", height: "500px" }}
                level={9}
                >
                {localDatas.map((localData, i) => (
                    <MapMarker
                        key={i}
                        position={{ lat: localData.latitude, lng: localData.longitude }}
                    >
                    </MapMarker>
                ))}
            </Map>
        
        </section>
        
        </>
    )
}