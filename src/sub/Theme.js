import { useEffect, useRef, useState } from "react";

export default function Theme(props) {
    const visitJejuData = props.visitJejuData;
    const tags = props.tags;

    const [select, setSelect] = useState('전체');
    const [inputValue, setInputValue] = useState(null);
    const [search, setSearch] = useState(visitJejuData);

    const [list, setList] = useState(visitJejuData);
    const [click, setClick] = useState('전체');

    // function filterClick(e) {
    //     setClick(e.target.value)
    //     let filterVisitJeju = visitJejuData.filter((visitJejuData) => visitJejuData.contentscd.label === e.target.value);
        
    //     if (e.target.value === '전체') {
    //         setSearch(visitJejuData.slice(0,6));
    //     } else {
    //         setSearch(filterVisitJeju.slice(0,6));
    //     }
    // }

    // 검색
    function searchDate(e) {
        e.preventDefault();

        switch (select) {
            case '전체' :
                const all = visitJejuData.filter((visitJejuData) => {
                    return (visitJejuData.address !== null && visitJejuData.address.includes(inputValue))
                    || (visitJejuData.title !== null && visitJejuData.title.includes(inputValue))
                    || (visitJejuData.alltag !== null && visitJejuData.alltag.includes(inputValue))
                });
                setSearch(all)
                break;
            case '주소' :
                const address = visitJejuData.filter((visitJejuData) => {
                    return visitJejuData.address !== null && visitJejuData.address.includes(inputValue)
                });
                setSearch(address)
                break;
            case '이름' :
                const title = visitJejuData.filter((visitJejuData) => {
                    return visitJejuData.title !== null && visitJejuData.title.includes(inputValue)
                });
                setSearch(title)
                break;
            case '태그' :
                const alltag = visitJejuData.filter((visitJejuData) => {
                    return visitJejuData.alltag !== null && visitJejuData.alltag.includes(inputValue)
                });
                setSearch(alltag)
                break;
        }
    }

    console.log(search)
    return (
        <>
        <section className="max-w-5xl mx-auto mt-12 mb-8 text-center">
            <h2 className="text-4xl font-bold text-amber-500 mb-6">여행을 떠나자!</h2>
            <form
                className="inline-flex shadow-md rounded-full mb-6"
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
                    className="border-y border-l py-2 px-4 outline-none"
                    type='text'
                    placeholder="검색"
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    className="text-white bg-amber-500 pl-4 pr-6 rounded-r-full hover:bg-amber-300 duration-300"
                    type="submit"
                >검색</button>
            </form>
            <div>
                {tags.map((tags, i) => (
                    <button
                        className="border border-amber-500 py-2 px-4 m-1 rounded-full hover:bg-amber-500 hover:text-white duration-300"
                        key={i}
                        value={tags}
                    >
                        {tags}
                    </button>
                ))}
            </div>
        </section>

        <List
            search = {search}
        />
        </>
    )
}


function List(props) {
    const search = props.search;

    console.log(search)
    const [pegeData, setPegeDate] = useState(search.slice(0, 12));
    const pegeBtn = []
    
    useEffect(() => {
        setPegeDate(search.slice(0, 12))
    }, [search])

    for (let i=1; i<=Math.floor((search.length)/12); i++) {
        pegeBtn.push(i)
    }
    

    return (
        <>
        <section className="max-w-5xl mx-auto flex flex-wrap">
            {pegeData.map((pegeData, i) => (
                <article
                    className="px-2 py-4 basis-1/2 lg:basis-1/4"
                    key={'article' + i}
                >
                    <div
                        className="h-60 overflow-hidden"
                        key={'div' + i}
                    >
                        <img
                            className="w-full h-full object-cover hover:scale-110 duration-300"
                            key={'img' + i}
                            src={pegeData.repPhoto.photoid.imgpath}
                        />
                    </div>
                    <h4 key={'title' + i}>{pegeData.title}</h4>
                </article>
            ))}
        </section>
        <div>
            {pegeBtn.map(pegeBtn => (
                <button
                    key={'pegeBtn' + pegeBtn}
                >
                    {pegeBtn}
                </button>
            ))}
        </div>
        </>
    )
}