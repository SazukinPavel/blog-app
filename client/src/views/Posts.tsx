import {useEffect, useState} from "react";
import {addPost, editPost, fetchCount, fetchPosts} from "../store/slices/postsSlice";
import {useAppDispatch, useAppSelector} from "../store";
import PostCard from "../components/PostCard";
import {Button, Modal, Pagination, Select, Spin, Tooltip} from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Post from "../types/Post";

function Posts() {

    const [limit, setLimit] = useState(20)
    const [page, setPage] = useState(1)
    const [template, setTemplate] = useState("")
    const [isEdit, setIsEdit] = useState("")
    const [isAddLoading, setIsAddLoading] = useState(false)

    const {posts, isFetchLoading, count} = useAppSelector((state) => state.posts)
    const {isAuthorize} = useAppSelector((state) => state.auth)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchCount())
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchPosts({
            limit
            , page: page - 1
        }))
    }, [count, limit, page,dispatch])

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        await add()
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const add = async () => {
        setIsAddLoading(true)
        if (!isEdit) {
            await dispatch(addPost({template}))
        } else {
            await dispatch(editPost({template, postId: isEdit}))
            setIsEdit("")
        }
        setIsAddLoading(false)
        setTemplate('')
    }

    const editPostHandler = (post: Post) => {
        setTemplate(post.template)
        setIsEdit(post._id)
        showModal()
    }

    return (<div>
            <div style={{display: 'flex', justifyContent: 'end', padding: '20px'}}>
                <Select
                    size="large"
                    style={{width: 120}}
                    value={limit}
                    onChange={(val) => setLimit(val)}
                    options={[
                        {value: 20, label: '20 posts'},
                        {value: 15, label: '15 posts'},
                        {value: 10, label: '10 posts'},
                        {value: 5, label: '5 posts'}
                    ]}/>
                <Tooltip title={isAuthorize ? '' : 'Only authorized users'}>
                    <Button onClick={showModal} style={{marginLeft: '20px'}} size="large" disabled={!isAuthorize}>Add
                        new</Button>
                </Tooltip>

            </div>
            {isFetchLoading ?
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: "center",
                    height: '50vh'
                }}>
                    <Spin tip="Loading..." size='large' spinning/>
                </div>
                : <div>
                    {
                        posts.map((p) =>
                            <PostCard onEditClick={editPostHandler} post={p} key={p._id}/>
                        )
                    }
                    <Pagination style={{width: '100%'}} total={count} pageSize={limit} current={page}
                                onChange={(val) => setPage(val)}/>
                </div>
            }
            <Modal confirmLoading={isAddLoading} width="100%" title="Your post template:" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <ReactQuill style={{minHeight:300}} preserveWhitespace
                    formats={[
                        'header', 'font', 'size',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image', 'video'
                    ]}
                    modules={{
                        toolbar: [
                            [{'header': '1'}, {'header': '2'}, {'font': []}],
                            [{size: []}],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'},
                                {'indent': '-1'}, {'indent': '+1'}],
                            ['link', 'image', 'video'],
                            ['clean']
                        ],
                        clipboard: {
                            matchVisual: false,
                        }
                    }}
                    theme="snow" value={template} onChange={setTemplate}
                />
            </Modal>
        </div>
    )
}

export default Posts