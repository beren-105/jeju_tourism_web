import { useEffect, useState } from 'react';
import { Map, MapMarker, CustomOverlayMap  } from 'react-kakao-maps-sdk';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faQuestion,
    faSun,
    faCloudRain,
    faCloudSun,
    faCloud,
    faSnowflake
} from "@fortawesome/free-solid-svg-icons";
import foodIcon from "./image/utensils.png"

// https://react-kakao-maps-sdk.jaeseokim.dev/docs/sample/overlay/categoryMarker

export default function KakaoMap(props) {

    const [weatherIcon, setWeatherIcon] = useState(faQuestion)
    const [inputs, setInputs] = useState('');

    const all = props.visitJejuData.filter(data => !!data.latitude && !!data.longitude);
    const [allDatas, setAllDatas] = useState(all);
    const [localDatas, setLocalDatas] = useState([]);
    const [foodDatas, setFoodDatas] = useState([]);


    // 날씨 세팅
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
    
    useEffect(()=> {
        weatherSetting();
        divideItems(all)
    }, [])

    // 일반 아이템과 음식점 아이템 분류
    function divideItems(items) {
        const locals = items
            .filter((item) => item.contentscd.label !== '음식점');
        const foods = items
            .filter((item) => item.contentscd.label === '음식점');

        setLocalDatas(locals);
        setFoodDatas(foods);
    }
    
    const [searchDatas, setSearchDatas] = useState([]);
    const [IsSearching, setIsSearching] = useState(false);

    //input 입력
    function hendleInput(value) {
        setInputs(value);

        if (value.trim() === '') {
            setIsSearching(false);
        } else {
            setIsSearching(true);
            const filterData =  filterItmes(value);
            setSearchDatas(filterData);
        }
    }

    // form 제출
    function hendleSubmit(e) {
        e.preventDefault();
        if (inputs.trim() === '') {
            setLocalDatas(all);

        } else {
            const filterData =  filterItmes(inputs);
            divideItems(filterData);
            setAllDatas(filterData);
        }
    }

    //검색어와 일치하는 아이템찾기
    function filterItmes(Keyword) {
        return all.filter(all => {
            return !!all.alltag && all.alltag.includes(Keyword) ||
            !!all.address && all.address.includes(Keyword) ||
            !!all.title && all.title.includes(Keyword) ||
            !!all.contentscd.label && all.contentscd.label.includes(Keyword)
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
                {allDatas.length > 0 ? 
                    allDatas.map((allData, i) => (
                        <List
                            key={i}
                            allData={allData}
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
                    <LocalMarker
                        key={i}
                        localData = {localData}
                    />
                ))}
                {foodDatas.map((foodData, i) => (
                    <MapMarker
                        key={i}
                        position={{ lat: foodData.latitude, lng: foodData.longitude }}
                        image = {{
                            src: foodIcon,
                            size: {
                                width: 35,
                                height: 35,
                            },
                            options: {
                                offset: {
                                  x: 35,
                                  y: 35,
                                },
                            },
                        }}
                    >
                    </MapMarker>
                ))}
            </Map>
        
        </section>
        
        </>
    )
}

function LocalMarker(props) {
    const localData = props.localData
    const [markerClick, setMarkerClick] = useState(false)
    console.log(localData)
    return (
        <MapMarker
            position={{ lat: localData.latitude, lng: localData.longitude }}
            onClick={() => setMarkerClick(!markerClick)}
        >
            {markerClick &&
                <article className='absolute -bottom-6 -left-14 w-64 h-32 bg-white rounded overflow-hidden'>
                    <h4 className='text-center font-bold p-2 w-full text-white bg-amber-500'>{localData.title}</h4>
                    <div className='flex items-center'>
                        <div className='m-2 w-16 h-16 overflow-hidden shrink-0'>
                            <img
                                className='w-full h-full object-cover'
                                src={localData.repPhoto.photoid.imgpath}
                            />
                        </div>
                        <p className='mr-2 text-sm'>{localData.roadaddress}</p>
                    </div>
                </article>
            }
        </MapMarker>
    
    )
}

function List(props) {
    const allData = props.allData;
    return (
        <article className='flex items-center pt-4 my-4 border-t'>
            <div className='w-28 h-28 mr-2 overflow-hidden shrink-0'>
                <img
                    className='w-full h-full object-cover'
                    src={allData.repPhoto.photoid.imgpath}
                    alt={allData.title}
                />
            </div>
            <div>
                <h4 className='text-xl'>{allData.title}</h4>
                <h4>{allData.contentscd.label}</h4>
                <p className='text-sm'>{allData.roadaddress}</p>
            </div>
        </article>
    )
}