
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { Post } from '../Models/Posts';
import { getPost } from '../Services/posts';
import { CommentModel } from '../Models/Comment'

interface IPostContextProps {
  post: Post | undefined
  getReplies: (parentId: string) => [];
  rootComments: []
  createLocalComment: (comment: CommentModel) => void
  updateLocalComment: (id: string, message: string) => void
  deleteLocalComment: (id: string) => void
  toggleLocalCommentLike:(id: string, addLike: boolean) => void
}

const PostContext = React.createContext<IPostContextProps>({
  post: new Post(),
  getReplies: (parentId: string) => [],
  rootComments: [],
  createLocalComment: (comment: CommentModel) => { },
  updateLocalComment: (id: string, message: string) => { },
  deleteLocalComment: (id: string) => { },
  toggleLocalCommentLike:(id: string, addLike: boolean)  => {}
});

interface PostProviderProps {
  children: React.ReactNode;
}
export function PostProvider({ children }: PostProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<Post>();
  const [comments, setComments] = useState<CommentModel[]>([])
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await getPost(id);
        setData(data);
      }
      catch (error: any) {
        setError(error);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [id])
  // const { isLoading, error, value: test } = useAsync<Post>(() => { getPost(id) }, [id]) // Data is not loading, so added useEffect again here in this file.

  const commentbyParentID = useMemo(() => {
    let group = Object.create(null);
    comments.forEach((comment: CommentModel) => {
      group[comment.parentId] ||= []
      group[comment.parentId].push(comment);
    })
    // group = data?.comments.reduce((r, comment) => { 
    //   r[comment.parentId] ||= []
    //   r[comment.parentId].push(comment)
    //   return r
    // }, Object.create(null)) 
    return group;
  }, [comments]);

  const getReplies = (parentId: string) => {
    return commentbyParentID[parentId];
  }

  const createLocalComment = (comment: CommentModel) => {
    setComments((prevComments: CommentModel[]) => {
      return [comment, ...prevComments]
    })
  }

  const updateLocalComment = (id: string, message: string) => {
    setComments((prevComments: CommentModel[]) => {
      return prevComments.map((comment: CommentModel) => {
        if (comment.id == id) {
          return { ...comment, message }
        }
        else {
          return comment
        }
      })
    })
  }
  const deleteLocalComment = (id: string) => {
    setComments((prevComments: CommentModel[]) => {
      return prevComments.filter((comment: CommentModel) => {
        return comment.id != id
      })
    })
  }

  const toggleLocalCommentLike = (id: string, addLike: boolean) => {
    setComments((prevComments: CommentModel[]) => {
      return prevComments.map((comment: CommentModel) => {
        if (comment.id == id) {
          if (addLike) {
            return { ...comment, likeCount: comment.likeCount + 1, likedByMe: true }
          }
          else {
            return { ...comment, likeCount: comment.likeCount - 1, likedByMe: false }
          }
        }
        else {
          return comment
        }
      })
    })
  }


  useEffect(() => {
    if (data?.comments == null) return;
    setComments(data.comments);
  }, [data?.comments])


  const value = {
    post: { id, ...data } as Post,
    getReplies: getReplies,
    rootComments: getReplies("null"),
    createLocalComment: createLocalComment,
    updateLocalComment: updateLocalComment,
    deleteLocalComment: deleteLocalComment,
    toggleLocalCommentLike: toggleLocalCommentLike
  }
  if (isLoading) return <h1>{'Loading Post..'}</h1>
  if (!!error) return <h1 className='error-msg'>{error}</h1>
  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  )
}


export function usePost() {
  return useContext(PostContext);
}