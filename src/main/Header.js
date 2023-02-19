
export default function Header() {
    return(
        <div className='w-full flex items-center justify-center bg-white shadow-md sticky top-0 left-0 z-50'>
            <h1 className='p-4'>로고</h1>
            <ul className='flex'>
                <li className='p-4'>메인</li>
                <li className='p-4'>지도보기</li>
                <li className='p-4'>날씨보기</li>
            </ul>
        </div>
    )
}