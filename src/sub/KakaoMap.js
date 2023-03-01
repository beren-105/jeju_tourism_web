import {Map, MapMarker, MapInfoWindow, Roadview, RoadviewMarker } from 'react-kakao-maps-sdk';

export default function KakaoMap(props) {
    const visitJejuData = props.visitJejuData;
    const nowWeather = props.nowWeather;
    const today = props.today;
    const tags = props.tags;


    console.log(tags)
    const localDatas = visitJejuData.filter(data => !!data.latitude && !!data.longitude)
    // console.log(localDatas)

    return(
        <>
        <section className='relative h-full bg-white'>
            <div className='absolute top-0 left-0 w-80 h-full bg-white z-40'>
                <article>

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