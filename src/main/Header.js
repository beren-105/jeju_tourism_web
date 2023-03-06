import { Link, useLocation } from "react-router-dom";
import logo from './image/location.png'
// import logo from './image/911128.png'
export default function Header() {
    const location = useLocation();
    
    return(
        <div className='w-full bg-white border-b sticky top-0 left-0 z-50'>
            <div className="relative max-w-5xl mx-auto flex items-center justify-between sm:justify-center">
                <Link to="/">
                    <div className="absolute py-2 top-0 left-0 inline-flex items-center text-xl font-bold text-amber-700">
                        <img
                            className="w-9 mr-2"
                            src={logo}
                        />
                        <h1>
                            오늘의 제주
                        </h1>
                    </div>
                </Link>
                <ul className='inline-flex'>
                    <Link to="/"><li className={`${location.pathname === '/' ? 'text-amber-500 font-bold' : null} relative py-4 px-2 sm:px-4 mx-2 group/line`}>
                        메인
                        <div className="absolute w-0 h-0.5 bottom-2 left-0 bg-amber-300 group-hover/line:w-full duration-300"></div>
                    </li></Link>
                    <Link to="/theme"><li className={`${location.pathname.includes('/theme')  ? 'text-amber-500 font-bold' : null} relative py-4 px-2 sm:px-4 mx-2 group/line`}>
                        테마찾기
                        <div className="absolute w-0 h-0.5 bottom-2 left-0 bg-amber-300 group-hover/line:w-full duration-300"></div>
                    </li></Link>
                    <Link to="/kakaomap"><li className={`${location.pathname === '/kakaomap' ? 'text-amber-500 font-bold' : null} relative py-4 px-2 sm:px-4 mx-2 group/line`}>
                        지도보기
                        <div className="absolute w-0 h-0.5 bottom-2 left-0 bg-amber-300 group-hover/line:w-full duration-300"></div>
                    </li></Link>
                </ul>
            </div>
        </div>
    )
}