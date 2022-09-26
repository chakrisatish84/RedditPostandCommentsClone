import { User } from "./User"
import {CommentModel} from "./Comment"

export class Like {
    user!: User
    comment!: CommentModel
    commentID!: String
}