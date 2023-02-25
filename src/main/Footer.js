import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faInstagram
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return(
        <div className='w-full bg-slate-700 text-white'>
            <div className="max-w-5xl mx-auto py-4 flex items-center justify-betweten">
                <ul className="flex">
                    <li className="p-2">회사소개</li>
                    <li className="p-2">이용약관</li>
                    <li className="p-2">개인정보처리방침</li>
                    <li className="p-2">소비자보호정책</li>
                    <li className="p-2">고객센터</li>
                </ul>
                <div>
                <FontAwesomeIcon icon={faInstagram} />
                </div>
            </div>
        </div>
    )
}