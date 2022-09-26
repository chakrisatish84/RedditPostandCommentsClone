import { makeRequest } from "./makeRequest"

export const createComment = (postId: string, message: string, parentId: string) => {
    return makeRequest(`/posts/${postId}/comments`, {
        method: "POST",
        data: { message, parentId }
    })
}

export const updateComment = (postId: string, message: string, id: string) => {
    return makeRequest(`/posts/${postId}/comments/${id}`, {
        method: "PUT",
        data: { message }
    })
}

export const deleteComment = (postId: string, id: string) => {
    return makeRequest(`/posts/${postId}/comments/${id}`, {
        method: "Delete"
    })
}

export const toggleComment = (id: string, postId: string) => {
    return makeRequest(`/posts/${postId}/comments/${id}/toggleLike`, {
        method: "POST"
    })
}