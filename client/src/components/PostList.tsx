import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { Post } from '../Models/Posts'
import { getAllPosts } from '../Services/posts'

export default function PostList() {
   const {isLoading, error, value: posts} = useAsync<Post>(getAllPosts);

    const postsUI = posts && Array.isArray(posts) && posts.map((post: Post) => {
        return <h1 key={post.id}><Link to={`/posts/${post.id}`}>{post.title}</Link></h1>
    })
    if(isLoading) return <h1>{'Loading'}</h1>
    if(error) return <h1>{error}</h1>
    return (
        <div>
            {postsUI}
        </div>
    )
}
