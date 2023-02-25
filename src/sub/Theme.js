import { useEffect, useRef, useState } from "react";

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
                const all = search.filter((visitJejuData) => {
                    return (visitJejuData.address !== null && visitJejuData.address.includes(inputValue))
                    || (visitJejuData.title !== null && visitJejuData.title.includes(inputValue))
                    || (visitJejuData.alltag !== null && visitJejuData.alltag.includes(inputValue))
                });
                setSearch(all);
                break;
            case '주소' :
                const address = search.filter((visitJejuData) => {
                    return visitJejuData.address !== null && visitJejuData.address.includes(inputValue)
                });
                setSearch(address);
                break;
            case '이름' :
                const title = search.filter((visitJejuData) => {
                    return visitJejuData.title !== null && visitJejuData.title.includes(inputValue)
                });
                setSearch(title);
                break;
            case '태그' :
                const alltag = search.filter((visitJejuData) => {
                    return visitJejuData.alltag !== null && visitJejuData.alltag.includes(inputValue)
                });
                setSearch(alltag);
                break;
            default :
                setSearch(visitJejuData);
        }
    }
    
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
        <article className="max-w-5xl mx-auto">
            <h2>검색 결과가 없습니다.</h2>
        </article>
        }
        </>
    )
}


function List(props) {
    const total = props.total;

    const [pegeData, setPegeDate] = useState(total.slice(0, 12));
    const pegeBtn = []
    
    useEffect(() => {
        setPegeDate(total.slice(0, 12))
    }, [total])

    for (let i=1; i<=Math.floor((total.length)/12); i++) {
        pegeBtn.push(i)
    }
    

    return (
        <>
        <section className="max-w-5xl mx-auto flex flex-wrap">
            {
                pegeData.map((pegeData, i) => (
                    <article
                        className="px-2 py-4 basis-1/2 lg:basis-1/4"
                        key={'article' + i}
                    >
                        <div
                            className="h-60 rounded overflow-hidden mb-2"
                            key={'div' + i}
                        >
                            <img
                                className="w-full h-full object-cover hover:scale-110 duration-300"
                                key={'img' + i}
                                src={pegeData.repPhoto.photoid.imgpath}
                            />
                        </div>
                        <h4
                            className="text-lg px-2"
                            key={'title' + i}
                        >{pegeData.title}</h4>
                    </article>
                ))
            }
        </section>
        <div className="max-w-5xl mx-auto text-center mb-4">
            {pegeBtn.map(pegeBtn => (
                <button
                    className="p-2 m-2"
                    key={'pegeBtn' + pegeBtn}
                >
                    {pegeBtn}
                </button>
            ))}
        </div>
        </>
    )
}