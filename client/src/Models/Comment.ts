import { Like } from './Like'
import { Post } from './Posts'
import { User } from './User'

export class CommentModel {
    public id!: string
    message!: string
    createdAt!: Date
    updatedAt!: Date
    user!: User
    post!: Post
    parent!: CommentModel
    children!: CommentModel
    parentId!: string
    likes!: Like[]
    likeCount!: number
    likedByMe!: boolean
}
