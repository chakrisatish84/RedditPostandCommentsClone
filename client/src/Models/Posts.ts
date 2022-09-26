import { CommentModel } from "./Comment"


export class Post  {
    public id!: string | undefined
    public title!: String
    public body!: String
    public comments!: CommentModel[]
}

