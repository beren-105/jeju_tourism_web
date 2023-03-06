import { useEffect, useState } from 'react';
import { Map, MapMarker, ZoomControl } from 'react-kakao-maps-sdk';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faQuestion,
    faSun,
    faCloudRain,
    faCloudSun,
    faCloud,
    faSnowflake,
    faChevronLeft,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import foodIcon from "./image/utensils.png"
import { useNavigate } from 'react-router-dom';

// https://react-kakao-maps-sdk.jaeseokim.dev/docs/sample/overlay/categoryMarker

export default function KakaoMap(props) {

    const [weatherIcon, setWeatherIcon] = useState(faQuestion)
    const [inputs, setInputs] = useState('');

    const all = props.visitJejuData.filter(data => !!data.latitude && !!data.longitude);
    const [allDatas, setAllDatas] = useState(all);
    const [localDatas, setLocalDatas] = useState([]);
    const [foodDatas, setFoodDatas] = useState([]);

    const [listShow, setListShow] = useState(true)


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
            setAllDatas(all);

        } else {
            const filterData =  filterItmes(inputs);
            divideItems(filterData);
            setAllDatas(filterData);
            setIsSearching(false);
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

    // 검색 버튼 클릭
    function searchClick(value) {
        setInputs(value);
        setIsSearching(false);
    }

    // 오늘의 최저/최고 기온/강수량
    function weatherForecast(items) {
        const weatherData = props.weatherData
        const today = props.today
        const filterWeather = weatherData
            .filter(weatherData =>weatherData.fcstDate === today && weatherData.category === items);
        return filterWeather[0].fcstValue;
    }

    return(
        <>
        <section className='relative h-screen bg-white'>
            {/* 리스트 닫기 버튼 */}
            <button
                className={`absolute top-1/2 -translate-y-1/2 p-2 pl-1 rounded-r-md bg-white z-40 duration-300 ${listShow ? 'left-80 sm:left-96' : 'left-0'}`}
                onClick={() => setListShow(!listShow)}
            >
                <FontAwesomeIcon
                    icon={faChevronRight}
                    size='xl'
                    color='#fbbf24'
                />
            </button>
            <div
                className={`absolute px-4 top-0 left-0 h-full bg-white z-30 overflow-y-auto duration-300 w-80 sm:w-96 ${listShow ? 'left-0' : '-left-80 sm:-left-96'}`}
            >
                {/* 검색창 */}
                <form
                    className='pt-6 flex'
                    onSubmit={(e) => hendleSubmit(e)}
                >
                    <input
                        className='border-2 border-r-0 rounded-l p-2 w-full'
                        type='text'
                        value={inputs}
                        onChange={(e) => hendleInput(e.target.value)}
                    />
                    <button
                        className='px-4 shrink-0 bg-amber-500 text-white rounded-r hover:bg-amber-300 duration-300'
                        type='submit'
                    >
                        검색
                    </button>
                </form>

                {/* 검색어와 관련된 리스트창 */}
                {IsSearching && searchDatas.length > 0 ?
                    <article className='relative'>
                        <ul className='absolute top-0 left-0 w-full border bg-white z-10'>
                            {searchDatas.slice(0, 5).map((searchData, i) => (
                                <li
                                    key={i}
                                    className='border-b hover:bg-amber-100'
                                >
                                    <button
                                        className='p-4 w-full text-left'
                                        type='button'
                                        onClick={(e) => searchClick(e.target.value)}
                                        value={searchData.title}
                                    >
                                        {searchData.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </article>
                : null}

                {/* 금일 날씨 */}
                <article className='flex items-center pt-4 h-20'>
                    <h3 className='flex items-center text-2xl pr-4 mr-4 border-r h-full'>오늘의 날씨</h3>
                    <div className='text-center mr-4'>
                        <FontAwesomeIcon
                            icon={weatherIcon}
                            color='#fbbf24'
                            size='2xl'
                        />
                        <p className='text-sm mt-1'>{props.nowWeather}</p>
                    </div>
                    <div className='text-sm'>
                        <p>최저기온 : {weatherForecast('TMN')}℃</p>
                        <p>최고기온 : {weatherForecast('TMX')}℃</p>
                    </div>
                </article>

                <Lists allDatas={allDatas} />
            </div>
            
            {/* 지도 */}
            <Map
                center={{ lat: 33.41667, lng: 126.50000 }}
                style={{ width: "100%", height: "100vh" }}
                level={9}
                >
                <ZoomControl
                    style={{ margin: '20px' }}
                />
                {localDatas.map((localData, i) => (
                    <LocalMarker
                        key={i}
                        localData = {localData}
                    />
                ))}
                {foodDatas.map((foodData, i) => (
                    <FoodMarker
                        key={i}
                        foodData = {foodData}
                    />
                ))}
            </Map>

        </section>
        </>
    )
}


function Lists(props) {
    const allDatas = props.allDatas

    // 페이지네이션
    const [pegeData, setPegeDate] = useState(allDatas.slice(0, 5));
    const [pege, setPege] = useState(1);
    const [pegeBtn, setPegeBtn] = useState([]);
    const [btns, setBtns] = useState([]);

    useEffect(() => {
        const arr = [];
        for (let i=1; i<=Math.ceil((allDatas.length)/5); i++) {
            arr.push(i)
        }

        setPegeBtn(arr);
        setPegeDate(allDatas.slice(0, 5));
    }, [allDatas])

    useEffect(() => {
        setBtns(pegeBtn.slice(0, 5));
    }, [pegeBtn])

    
    // 페이지 이동
    function pegeClick(index) {
        setPegeDate(allDatas.slice((5*index-5), (5*index)));
        setPege(index);

        if (index > 4) {
            setBtns(pegeBtn.slice((index-4), (index+1)))
        } else {
            setBtns(pegeBtn.slice(0, 5));
        }
    }

    return (
        <>
        {pegeData.length > 0 ? 
            pegeData.map((pegeData, i) => (
                <List
                    key={i}
                    pegeData={pegeData}
                />
            ))
        : null}
        <div className="max-w-5xl mx-auto text-center my-6">
            <button
                disabled = {pege === 1 ? true : false}
                onClick={() => pegeClick(pege-1)}
            >
                <FontAwesomeIcon
                    className="mr-4"
                    icon={faChevronLeft}
                    color='#bbb'
                />
            </button>
            {btns.map((btn, i) => (
                <button
                    type='button'
                    className={`m-1 w-8 h-8 hover:bg-amber-300 rounded-full duration-300 ${pege === btn ? 'bg-amber-500 text-white font-bold' : null}`}
                    key={'btn' + i}
                    onClick={() => pegeClick(btn)}
                    value={btn}
                >
                    {btn}
                </button>
            ))}
            <button
                disabled = {pege === pegeBtn.length ? true : false}
                onClick={() => pegeClick(pege+1)}
            >
                <FontAwesomeIcon
                    className="ml-4"
                    icon={faChevronRight}
                    color='#bbb'
                />
            </button>
        </div>
        </>
    )
}

function List(props) {
    const pegeData = props.pegeData;

    const navigate = useNavigate();
    function navDealil(item) {
        navigate('/theme/'+item.contentsid, {state: {item: item}});
    }

    return (
        <article className='flex items-center pt-4 my-4 border-t'>
            <div className='w-24 h-24 mr-4 overflow-hidden shrink-0'>
                <img
                    className='w-full h-full object-cover'
                    src={pegeData.repPhoto.photoid.imgpath}
                    alt={pegeData.title}
                />
            </div>
            <div>
                <h4
                    className='cursor-pointer text-xl'
                    onClick={() => navDealil(pegeData)}
                >{pegeData.title}</h4>
                <p className='text-sm'>{pegeData.contentscd.label}</p>
                <p className='text-sm text-zinc-400'>{pegeData.roadaddress}</p>
            </div>
        </article>
    )
}

function LocalMarker(props) {
    const localData = props.localData
    const [markerClick, setMarkerClick] = useState(false)
    
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

function FoodMarker(props) {
    const foodData = props.foodData
    const [markerClick, setMarkerClick] = useState(false)
    
    return (
        <MapMarker
            position={{ lat: foodData.latitude, lng: foodData.longitude }}
            onClick={() => setMarkerClick(!markerClick)}
            image = {{
                src: foodIcon,
                size: {
                    width: 35,
                    height: 35,
                },
                options: {
                    offset: {
                        x: 20,
                        y: 35,
                    },
                },
            }}
        >
            {markerClick &&
                <article className='absolute -bottom-6 -left-14 w-64 h-32 bg-white rounded overflow-hidden'>
                    <h4 className='text-center font-bold p-2 w-full text-white bg-amber-500'>{foodData.title}</h4>
                    <div className='flex items-center'>
                        <div className='m-2 w-16 h-16 overflow-hidden shrink-0'>
                            <img
                                className='w-full h-full object-cover'
                                src={foodData.repPhoto.photoid.imgpath}
                            />
                        </div>
                        <p className='mr-2 text-sm'>{foodData.roadaddress}</p>
                    </div>
                </article>
            }
        </MapMarker>
    
    )
}
