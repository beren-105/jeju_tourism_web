import { useRef, useState } from "react";
import { useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenNib, faCheck, faL } from "@fortawesome/free-solid-svg-icons";

import jejuImg from './image/jejuImg.jpg';

export default function Detail() {
    const location = useLocation()
    const item = location.state.item

    const tags = []

    function tag() {
        const tagArr = item.alltag.split(',')
        tagArr.forEach(tagArr => tags.push(tagArr));
    }
    tag()

    return (
        <>
        <section className="relative h-60 mb-12">
            <h2 className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-4xl p-2 text-white">{item.contentscd.label}</h2>
            <img
                className="w-full h-full object-cover"
                src={jejuImg}
                alt='제주도'
            />
        </section>
        <section className="max-w-5xl mx-auto mb-12">
            <div className="pt-4 pb-6 px-20 border-y border-t-4 text-center mb-8">
                <h2 className="text-3xl p-4 font-bold text-amber-500">{item.title}</h2>
                {tags.map(tag => (
                    <span
                        className="p-1 text-zinc-400"
                        key={tag}
                    >
                        #{tag}
                    </span>
                ))}
            </div>
            <div className="flex flex-col lg:flex-row px-8">
                {item.repPhoto !== null ?
                    <img
                        className="object-cover mb-8 lg:w-1/3 lg:mr-4"
                        src={item.repPhoto.photoid.imgpath}
                        alt={item.title}
                    />
                : null }
                <div className="text-lg leading-8">
                    <p>{item.introduction}</p>
                    <p>
                        <span className="font-bold text-amber-500">주소 : </span>
                        {item.address}
                    </p>
                    <p>
                        <span className="font-bold text-amber-500">전화번호 : </span>
                        {item.phoneno}
                    </p>
                </div>
            </div>
        </section>

        <Comment />
        </>
    )
}

function Comment() {
    const [comments, setComments] = useState([]);

    const [inputs, setInputs] = useState('');
    const [option, setOption] = useState('★★★★★');
    const [inputContent, setInputConetne] = useState(true);

    // 댓글 달기
    function addComment(e) {
        e.preventDefault();

        if (inputs.trim() === '') {
            setInputConetne(false);
        } else {
            setInputConetne(true);
            const date = new Date();
            const objects = [{
                id: Math.floor(Math.random()*10000),
                comment: inputs,
                score: option,
                date: date.getFullYear() + '년 ' + date.getMonth()+1 + '월 ' + date.getDate() + '일 ' + date.getHours() + '시 ' + date.getMinutes() + '분',
                editing : true
            }];
            const updateComment = [...objects, ...comments];
    
            setComments(updateComment);
            setInputs('');
        }
    }

    const inputRef = useRef(null)
    const [newScore, setNewScore] = useState('★★★★★')
    const [newComment, setNewComment] = useState('')

    // 댓글 수정하기
    function editComment(id) {
        setNewComment('')
        const edit = comments.map((comment) => {
            if (comment.id === id) {
                return {...comment, editing:false}
            } else {
                return comment
            }
        })
        setComments(edit)
        
        inputRef.current.focus()
    }
    function saveComment(id) {
        if (inputRef.current.value.trim() !== '') {
            const edit = comments.map((comment) => {
                if (comment.id === id) {
                    return {...comment, comment:newComment, score:newScore, editing:true}
                } else {
                    return comment
                }
            })
            setComments(edit)
        }
    }

    // 댓글 삭제하기
    function deleteComment(id) {
        const filter = comments.filter(comments => comments.id !== id);
        setComments(filter);
    }


    return (
        <article className="max-w-5xl mx-auto mb-12 p-8">
            <h3 className="text-xl font-bold text-amber-500 mb-4">리뷰</h3>
            <form
                className="border-y border-t-4 py-8"
                onSubmit={(e) => addComment(e)}
            >
                <select
                    className="text-amber-500 mb-2"
                    onChange={(e) => setOption(e.target.value)}
                >
                    <option value='★★★★★'>★★★★★</option>
                    <option value='★★★★☆'>★★★★☆</option>
                    <option value='★★★☆☆'>★★★☆☆</option>
                    <option value='★★☆☆☆'>★★☆☆☆</option>
                    <option value='★☆☆☆☆'>★☆☆☆☆</option>
                </select>
                <div className="flex">
                    <input
                        className="border w-full rounded"
                        type='text'
                        onChange={(e) => setInputs(e.target.value)}
                        value={inputs}
                        placeholder='댓글을 입력해주세요.'
                    />
                    <button
                        className="w-1/6 bg-amber-500 text-white p-4 rounded hover:bg-amber-300 duration-300"
                        type="submit"
                    >
                        작성하기
                    </button>
                </div>
                {inputContent ? null :
                    <p className="mt-2 text-red-500">* 내용을 입력해주세요!</p>
                }
            </form>
            <ul>
                {comments.length === 0 ?
                    <li className="text-center py-8">현재 리뷰가 없습니다.</li>
                :
                    comments.map((comments, i) => (
                        <li className="border-b p-4 flex justify-between items-center" key={comments.id} >
                        {comments.editing ?
                        <>
                            <div className="w-full" key={'comments' + i}>
                                <p className="text-sm text-zinc-300" key={'score' + i}>
                                    {comments.score}
                                </p>
                                <input
                                    className={`mb-4 w-full ${comments.editing ? 'outline-none' : 'border'}`}
                                    key={'comment' + i}
                                    value={comments.comment}
                                    readOnly={comments.editing ? true : false}
                                    ref={inputRef}
                                />
                                <p className="text-sm text-zinc-300" key={'date' + i}>
                                    {comments.date}
                                </p>
                            </div>
                            <div className="shrink-0" key={'btns' + i}>
                                <button
                                    className="pr-4"
                                    key={'Edit' + i}
                                    onClick={() => editComment(comments.id)}
                                >
                                    <FontAwesomeIcon
                                        icon={faPenNib}
                                        size='xl'
                                        color='#7DB9B6'
                                    />
                                </button>
                                <button
                                    key={'delete' + i}
                                    onClick={() => deleteComment(comments.id)}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        size='xl'
                                        color='#E96479'
                                    />
                                </button>
                            </div>
                            </>
                            :
                            <>
                            <div className="w-full" key={'comments' + i}>
                                <select
                                className="text-amber-500 mb-2"
                                onChange={(e) => setNewScore(e.target.value)}
                                >
                                <option value='★★★★★'>★★★★★</option>
                                <option value='★★★★☆'>★★★★☆</option>
                                <option value='★★★☆☆'>★★★☆☆</option>
                                <option value='★★☆☆☆'>★★☆☆☆</option>
                                <option value='★☆☆☆☆'>★☆☆☆☆</option>
                                </select>
                                <input
                                    className={`mb-4 ${comments.editing ? 'outline-none' : 'border w-full'}`}
                                    key={'comment' + i}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    ref={inputRef}
                                />
                                <p className="text-sm text-zinc-300" key={'date' + i}>
                                    {comments.date}
                                </p>
                            </div>
                            <div className="shrink-0" key={'btns' + i}>
                                <button
                                    className="pr-4"
                                    key={'Edit' + i}
                                    onClick={() => saveComment(comments.id)}
                                >
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        size='xl'
                                        color='#7DB9B6'
                                    />
                                </button>
                                <button
                                    key={'delete' + i}
                                    onClick={() => deleteComment(comments.id)}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        size='xl'
                                        color='#E96479'
                                    />
                                </button>
                            </div>
                            </>
                            }
                        </li>
                        
                    ))
                }
            </ul>
        </article>
    )
}
