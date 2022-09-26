import { Like } from "./Like"
import { CommentModel } from "./Comment"

export class User {
    id!: string
    name!: String
    comments!: CommentModel[]
    likes!: Like[]
}