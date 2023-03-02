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

    const all = visitJejuData.filter(data => !!data.latitude && !!data.longitude);
    const [localDatas, setLocalDatas] = useState(all);
    const [searchDatas, setSearchDatas] = useState([]);
    const [IsSearching, setIsSearching] = useState(false);

    useEffect(()=> {
        weatherSetting();
    }, [])


    //input 입력
    function hendleInput(value) {
        setInputs(value)

        if (value.trim() === '') {
            setIsSearching(false)
        } else {
            setIsSearching(true)
            const filterData =  filterItmes(value)
            setSearchDatas(filterData)
        }
    }

    console.log(searchDatas)

    // form 제출
    function hendleSubmit(e) {
        e.preventDefault();
        if (inputs.trim() === '') {
            setLocalDatas(all)

        } else {
            const filterData =  filterItmes(inputs)
            setLocalDatas(filterData)
        }
    }

    //검색어와 일치하는 아이템찾기
    function filterItmes(Keyword) {
        return all.filter(visitJejuData => {
            return !!visitJejuData.alltag && visitJejuData.alltag.includes(Keyword) ||
            !!visitJejuData.address && visitJejuData.address.includes(Keyword) ||
            !!visitJejuData.title && visitJejuData.title.includes(Keyword) ||
            !!visitJejuData.contentscd.label && visitJejuData.contentscd.label.includes(Keyword)
        })
    }


    return(
        <>
        <section className='relative h-screen bg-white'>
            <div
                style={{width: '450px'}}
                className='absolute px-4 top-0 left-0 h-full bg-white z-40 overflow-y-auto'>
                <form
                    className='pt-6 flex'
                    onSubmit={(e) => hendleSubmit(e)}
                >
                    <input
                        className='border-2 border-r-0 rounded-l p-2 w-full'
                        type='text'
                        value={inputs}
                        onChange={(e) => hendleInput(e.target.value)}
                        onBlur={() => setIsSearching(false)}
                    />
                    <button
                        className='px-4 shrink-0 bg-amber-500 text-white rounded-r hover:bg-amber-300 duration-300'
                        type='submit'
                    >
                        검색
                    </button>
                </form>
                {IsSearching && searchDatas.length > 0 ?
                    <article className='relative'>
                        <ul className='absolute top-0 left-0 w-full border bg-white z-10'>
                            {searchDatas.slice(0, 5).map((searchData, i) => (
                                <li
                                    key={i}
                                    className='p-4 border-b hover:bg-amber-100'
                                >
                                    {searchData.title}
                                </li>
                            ))}
                        </ul>
                    </article>
                : null}
                <article>
                    <h3>오늘의 날씨</h3>
                    <p>{props.nowWeather}</p>
                    <FontAwesomeIcon
                        icon={weatherIcon}
                    />
                </article>
                {localDatas.length > 0 ? 
                    localDatas.map((localData, i) => (
                        <LocalList
                            key={i}
                            localData={localData}
                        />
                    ))
                : null}
            </div>
            <Map
                center={{ lat: 33.41667, lng: 126.50000 }}
                style={{ width: "100%", height: "100vh" }}
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


function LocalList(props) {
    const localData = props.localData;
    return (
        <article className='flex items-center pt-4 my-4 border-t'>
            <div className='w-28 h-28 mr-2 overflow-hidden shrink-0'>
                <img
                    className='w-full h-full object-cover'
                    src={localData.repPhoto.photoid.imgpath}
                    alt={localData.title}
                />
            </div>
            <div>
                <h4 className='text-xl'>{localData.title}</h4>
                <h4>{localData.contentscd.label}</h4>
                <p className='text-sm'>{localData.roadaddress}</p>
            </div>
        </article>
    )
}