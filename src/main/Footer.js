import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faInstagram,
    faTwitter,
    faFacebook
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return(
        <div className='w-full bg-slate-700 text-white'>
            <div className="max-w-5xl mx-auto py-8 flex flex-col items-center sm:items-stretch sm:justify-between sm:flex-row">
                <ul className="flex basis-full flex-col font-light items-center sm:basis-2/3 sm:flex-row sm:items-start">
                    <li className="p-2">회사소개</li>
                    <li className="p-2">이용약관</li>
                    <li className="p-2">개인정보처리방침</li>
                    <li className="p-2">소비자보호정책</li>
                    <li className="p-2">고객센터</li>
                </ul>
                <div className="flex flex-col sm:flex-row">
                    <div className="sm:mr-4">
                        <ul className="flex flex-col items-center text-amber-200 sm:items-start">
                            <Link to="/"><li className="p-2">메인</li></Link>
                            <Link to="/theme"><li className="p-2">테마찾기</li></Link>
                            <Link to="/kakaomap"><li className="p-2">지도보기</li></Link>
                        </ul>
                    </div>
                    <div>
                        <FontAwesomeIcon
                            className="cursor-pointer p-2"
                            icon={faInstagram}
                            size='xl'
                        />
                        <FontAwesomeIcon
                            className="cursor-pointer p-2 rounded-full"
                            icon={faTwitter}
                            size='xl'
                        />
                        <FontAwesomeIcon
                            className="cursor-pointer p-2"
                            icon={faFacebook}
                            size='xl'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}