import { Certificate } from 'crypto'
import { CommentModel } from '../Models/Comment'
import { dateFormatter } from '../utils/dateFormatter'
import { IconBtn } from './IconBtn'
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from 'react-icons/fa'
import { usePost } from '../Contexts/PostContext'
import { useState } from 'react'
import { CommentsList } from './CommentsList'
import { CommentForm } from './CommentForm'
import { useAsycFn } from '../hooks/useAsync'
import { createComment, deleteComment, toggleComment, updateComment } from '../Services/comments'
import { useUser } from '../hooks/useUser'

type CommentProps = {
    comment: CommentModel
}
export function Comment({ comment }: CommentProps) {
    const { id, message, user, createdAt, likeCount, likedByMe } = comment

    const [areChildrenHidden, setAreChildrenHidden] = useState(false);
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleeting, setIsDeleting] = useState<boolean>(false);
    const { getReplies, post, createLocalComment, updateLocalComment, deleteLocalComment, toggleLocalCommentLike } = usePost();
    const childComments = getReplies(id);
    const createCommentfn = useAsycFn<CommentModel>(createComment);
    const updateCommentfn = useAsycFn<CommentModel>(updateComment);
    const deleteommentfn = useAsycFn<CommentModel>(deleteComment);
    const toggleCommentLikefn = useAsycFn<CommentModel>(toggleComment);

    const currentUser = useUser();

    const onCommentReply = async (message: string) => {
        await createCommentfn.execute(post?.id, message, id)
        setIsReplying(false)
        if (createCommentfn.value) {
            createLocalComment(createCommentfn.value as CommentModel)
        }
    }

    const onCommentUpdate = async (message: string) => {
        await updateCommentfn.execute(post?.id, message, id)
        setIsEditing(false)
        if (updateCommentfn.value) {
            updateLocalComment(id, message)
        }
    }

    const onCommentDelete = async () => {
        await deleteommentfn.execute(post?.id, id)
        setIsDeleting(false)
        if (deleteommentfn.value) {
            deleteLocalComment(id)
        }
    }

    const onToggelCommentLike = async () =>{
        const data = await toggleCommentLikefn.execute(id, post?.id)
        // toggleLocalCommentLike(id,  )
    }
    return (
        <>
            <div className="comment">
                <div className="header">
                    <span className="name">{user.name}</span>
                    <span className="date">
                        {dateFormatter.format(Date.parse(createdAt.toString()))}
                    </span>
                </div>
                {isEditing ? <CommentForm autoFocus={true} initialValue={message} onSubmit={onCommentUpdate} loading={updateCommentfn.isLoading} error={updateCommentfn.error} /> : <div className='message'>
                    <span>{message}</span>
                </div>
                }
                <div className='footer'>
                    <IconBtn onBtnClick={onToggelCommentLike} Icon={likedByMe ? FaHeart : FaRegHeart} aria-label="Like">{likeCount}</IconBtn>
                    <IconBtn isActive={isReplying} Icon={FaReply} aria-label={isReplying ? "Cancel Reply" : "Reply"} onBtnClick={() => setIsReplying(prev => !prev)}>2</IconBtn>
                    {user.id === currentUser.id && (
                        <>
                            <IconBtn isActive={isEditing} Icon={FaEdit} aria-label={isEditing ? "Cancel Eidt" : "Edit"} onBtnClick={() => setIsEditing(prev => !prev)}>2</IconBtn>
                            <IconBtn Icon={FaTrash} aria-label={isDeleeting ? "Cancel Delete" : "Delete"} color='danger' onBtnClick={onCommentDelete}>2</IconBtn>
                        </>
                    )}
                </div>
                {deleteommentfn.error && (
                    <div className='error-msg mt-1'>{deleteommentfn.error}</div>
                )}
            </div>

            {isReplying && (
                <div className='mt-1 ml-3'>
                    <CommentForm autoFocus={true} initialValue="" onSubmit={onCommentReply} loading={createCommentfn.isLoading} error={createCommentfn.error} />
                </div>
            )}

            {childComments?.length > 0 && (
                <>
                    <div className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""}`}>
                        <button className='collapse-line' aria-label='Hide Replies' onClick={() => { setAreChildrenHidden(true) }} />
                        <div className='nested-comments'>
                            <CommentsList comments={childComments} />
                        </div>
                    </div>
                    <button className={`btn mt-1 ${!areChildrenHidden ? 'hide' : ""}`} onClick={() => { setAreChildrenHidden(false) }}>Show Replies</button>
                </>
            )}
        </>
    )
}