import { usePost } from "../Contexts/PostContext";
import { useAsycFn } from "../hooks/useAsync";
import { Post as TestPost } from '../Models/Posts'
import { createComment } from "../Services/comments";
import { CommentForm } from "./CommentForm";
import { CommentsList } from "./CommentsList";
import {CommentModel} from "../Models/Comment"

export function Post() {
    const { post, rootComments, createLocalComment } = usePost();

    const { isLoading, error, value, execute: createCommentfn } = useAsycFn<CommentModel>(createComment);

    async function onCommentCreate(message: string) {
        const postId = post?.id;
        await createCommentfn(postId, message)
        // createLocalComment(value)
    }

    if (!post) return <>{'Empty'}</>
    return (
        <>
            <h1>{post.id}</h1>
            <article>{post.body}</article>
            <h3 className="comments-title">Comments</h3>
            <section>
                <CommentForm loading={isLoading} error={error} initialValue="" onSubmit={onCommentCreate} />
                {rootComments && rootComments.length > 0 && (
                    <div className="mt-4">
                        <CommentsList comments={rootComments} />
                    </div>
                )}
            </section>
        </>
    )
}