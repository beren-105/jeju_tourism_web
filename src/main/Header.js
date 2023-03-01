import { Link } from "react-router-dom";

export default function Header() {
    return(
        <div className='w-full flex items-center justify-center bg-white shadow-md sticky top-0 left-0 z-50'>
            <h1 className='p-4'>로고</h1>
            <ul className='flex'>
                <Link to="/"><li className='p-4'>메인</li></Link>
                <Link to="/theme"><li className='p-4'>테마찾기</li></Link>
                <Link to="/kakaomap"><li className='p-4'>날씨보기</li></Link>
            </ul>
        </div>
    )
}