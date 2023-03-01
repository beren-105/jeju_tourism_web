import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Theme(props) {
    const visitJejuData = props.visitJejuData;
    const tags = props.tags;

    
    const [total, setTotal] = useState(visitJejuData);

    // 검색창
    const [select, setSelect] = useState('전체');
    const [search, setSearch] = useState(visitJejuData);
    const [inputValue, setInputValue] = useState('');
    const [searchWord, setSearchWord] = useState(null);
    const [searching, setSearching] = useState(false);

    // 분류버튼
    const [tag, setTag] = useState(visitJejuData);
    const [click, setClick] = useState('전체');
    

    // 분류 버튼 클릭
    function filterClick(e) {
        setClick(e.target.value)
        let filterVisitJeju = visitJejuData.filter((visitJejuData) => visitJejuData.contentscd.label === e.target.value);
        
        if (e.target.value === '전체') {
            setTag(visitJejuData);
        } else {
            setTag(filterVisitJeju);
        }

    }

    // 검색
    function searchDate(e) {
        e.preventDefault();

        switch (select) {
            case '전체' :
                const all = visitJejuData.filter((visitJejuData) => {
                    return (!!visitJejuData.address && visitJejuData.address.includes(inputValue))
                    || (!!visitJejuData.title && visitJejuData.title.includes(inputValue))
                    || (!!visitJejuData.alltag && visitJejuData.alltag.includes(inputValue))
                });
                setSearch(all);
                break;
            case '주소' :
                const address = visitJejuData.filter((visitJejuData) => {
                    return !!visitJejuData.address && visitJejuData.address.includes(inputValue)
                });
                setSearch(address);
                break;
            case '이름' :
                const title = visitJejuData.filter((visitJejuData) => {
                    return !!visitJejuData.title && visitJejuData.title.includes(inputValue)
                });
                setSearch(title);
                break;
            case '태그' :
                const alltag = visitJejuData.filter((visitJejuData) => {
                    return !!visitJejuData.alltag && visitJejuData.alltag.includes(inputValue)
                });
                setSearch(alltag);
                break;
            default :
                setSearch(visitJejuData);
        }
    }
    
    // 분류 버튼과 검색창 결과 필터링
    function matchingData(search, tag) {
        if (search.length === 0 || tag.length === 0) {
            setTotal(null);
            setTotal(null);
        } else if (tag.length === 0) {
        } else if (search.length >= tag.length) {
            const tagArr = []
            tag.map(tag => tagArr.push(tag.contentsid))
            const arr = search.filter((search) => {
                    return tagArr.includes(search.contentsid)
            });
            setTotal(arr);
        } else {
            const searchArr = []
            search.map(search => searchArr.push(search.contentsid))
            const arr = tag.filter((tag) => {
                    return searchArr.includes(tag.contentsid)
            });
            setTotal(arr);
        }
    }

    useEffect(() => {
        if (inputValue !== '') {
            setSearching(true);
            setSearchWord(inputValue);
        } else {
            setSearching(false);
            setSearch(visitJejuData)
        }

        matchingData(search, tag)
    }, [search, tag])

    return (
        <>
        <section className="max-w-5xl mx-auto mt-14 mb-6 text-center border-b pb-8">
            <h2 className="text-4xl font-bold text-amber-500 mb-3">여행을 떠나자!</h2>
            <form
                className={`inline-flex shadow-md rounded-full ${searching ? 'mb-4' : 'mb-6'}`}
                onSubmit={(e) => searchDate(e)}
            >
                <select
                    className="border-y border-l px-4 rounded-l-full"
                    onChange={(e) => setSelect(e.target.value)}
                >
                    <option value='전체'>전체</option>
                    <option value='주소'>주소</option>
                    <option value='이름'>이름</option>
                    <option value='태그'>태그</option>
                </select>
                <input
                    className="border-y border-l py-2 px-4 outline-none text-lg"
                    type='text'
                    placeholder="검색"
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    className="text-white bg-amber-500 pl-4 pr-6 rounded-r-full hover:bg-amber-300 duration-300"
                    type="submit"
                >검색</button>
            </form>
            {searching ? <p className="mb-6 text-zinc-400">"{searchWord}"를 검색중입니다.</p> : null}
            <div>
                {tags.map((tags, i) => (
                    <button
                        className={`border border-amber-500 py-2 px-4 m-1 rounded-full hover:bg-amber-500 hover:text-white duration-300 ${tags === click ? 'bg-amber-500 text-white font-bold' : null }`}
                        key={i}
                        value={tags}
                        onClick={(e) => filterClick(e)}
                    >
                        {tags}
                    </button>
                ))}
            </div>
        </section>
        {total !== null ?
            <List
                total = {total}
            />
        :
        <article className="max-w-5xl mx-auto text-center">
            <h3 className="text-2xl my-12">검색 결과가 없습니다.</h3>
        </article>
        }
        </>
    )
}


function List(props) {
    const total = props.total;

    const [pegeData, setPegeDate] = useState(total.slice(0, 12));
    const [pege, setPege] = useState(1);
    const pegeBtn = []
    
    useEffect(() => {
        setPegeDate(total.slice(0, 12))
    }, [total])

    for (let i=1; i<=Math.ceil((total.length)/12); i++) {
        pegeBtn.push(i)
    }

    // 페이지 이동
    function pegeClick(index) {
        setPegeDate(total.slice((12*index-12), (12*index)))
        setPege(index)
    }
    

    return (
        <>
        <section className="max-w-5xl mx-auto flex flex-wrap">
            {
                pegeData.map(pegeData => (
                    <Article
                    pegeData = {pegeData}
                    />
                ))
            }
        </section>
        <div className="max-w-5xl mx-auto text-center mb-8">
            {pegeBtn.map((pegeBtn, i) => (
                <button
                    className={`m-1 w-8 h-8 hover:bg-amber-300 rounded-full duration-300 ${pege === i+1 ? 'bg-amber-500 text-white font-bold' : null}`}
                    key={'pegeBtn' + pegeBtn}
                    onClick={() => pegeClick(i+1)}
                >
                    {pegeBtn}
                </button>
            ))}
        </div>
        </>
    )
}

function Article(props) {
    const pegeData = props.pegeData
    const navigate = useNavigate();
    
    function navDealil(item) {
        navigate('/theme/'+item.contentsid, {state: {item: item}});
    }

    return (
        <article className="px-2 py-4 basis-1/2 lg:basis-1/4">
            <div
                className="cursor-pointer h-60 rounded overflow-hidden mb-2 bg-zinc-300 flex items-center justify-center text-center"
                onClick={() => navDealil(pegeData)}
            >
                {pegeData.repPhoto === null ?
                    <div>
                        <FontAwesomeIcon
                            icon={faQuestion}
                            size='2xl'
                        />
                        <p>이미지를 준비 중 입니다.</p>
                    </div>
                :
                <img
                    className="w-full h-full object-cover hover:scale-110 duration-300"
                    src={pegeData.repPhoto.photoid.imgpath}
                />
                }
            </div>
            <h4
                className="text-lg px-2"
            >{pegeData.title}</h4>
        </article>
    )
}