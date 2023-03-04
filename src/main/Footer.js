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
            <div className="max-w-5xl mx-auto py-8 flex items-start justify-between">
                <ul className="flex basis-2/3 font-light">
                    <li className="p-2">회사소개</li>
                    <li className="p-2">이용약관</li>
                    <li className="p-2">개인정보처리방침</li>
                    <li className="p-2">소비자보호정책</li>
                    <li className="p-2">고객센터</li>
                </ul>
                <div>
                    <ul className="font-extralight">
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
    )
}