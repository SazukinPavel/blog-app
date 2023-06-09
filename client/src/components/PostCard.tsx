import Post from "../types/Post";
import {Button, Card} from "antd";
import moment from "moment";
import {useAppDispatch, useAppSelector} from "../store";
import {deletePost} from "../store/slices/postsSlice";
import {useState} from "react";


interface PostCardProps {
    post: Post,
    onEditClick: any
}

function PostCard({post, onEditClick}: PostCardProps) {

    const dispatch = useAppDispatch()
    const [isDeleteLoading,setIsDeleteLoading]=useState(false)
    const {isAuthorize, user} = useAppSelector((store) => store.auth)

    const deletePostHandler = async () => {
        setIsDeleteLoading(true)
        await dispatch(deletePost(post._id))
        setIsDeleteLoading(false)
    }

    return (
        <Card style={{margin: 20}}
              title={`${post.owner.login} at ${moment(post.createdAt).local().format('YYYY-MM-DD hh:mm')}`}>
            <div className="post-card" dangerouslySetInnerHTML={{__html: post.template}}>
            </div>
            {
                isAuthorize && user && user._id === post.owner._id &&
                <div style={{display: "flex", alignItems: 'center', justifyContent: 'end'}}>
                    <Button loading={isDeleteLoading} onClick={deletePostHandler} style={{margin: 5}} size={"large"}>Delete</Button>
                    <Button onClick={() => onEditClick(post)} style={{margin: 5}} size={"large"}>Edit</Button>
                </div>
            }
        </Card>
    )
}

export default PostCard