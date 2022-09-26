import { CommentModel as CommentModel } from "../Models/Comment"

import { Comment } from "./Comment"

type CommentListProps = {
    comments: CommentModel[]
}
export function CommentsList({ comments }: CommentListProps) {
    const commentSeciton = comments.map((comment: CommentModel) => {
        return (<div key={comment.id} className='comment-stack'>
            <Comment comment={comment} />
        </div>
        )
    })
    return (
        <>{commentSeciton}</>
    )
}