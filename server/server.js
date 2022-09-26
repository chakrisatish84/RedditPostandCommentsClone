import fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import sensible from "@fastify/sensible";
import cookie from "@fastify/cookie"
dotenv.config();

const app = fastify();
app.register(sensible);
app.register(cors, {
    origin: process.env.CLIENT_URL,
    credentials: true
})
app.register(cookie, { secret: process.env.COOKIE_SECRET })

app.addHook("onRequest", (req, res, done) => {
    if (req.cookies.userId == undefined || req.cookies.userId !== CURRENT_USER_ID) {
        req.cookies.userId = CURRENT_USER_ID;
        res.clearCookie("userId");
        res.setCookie("userId", CURRENT_USER_ID)
    }
    done()
})

const prisma = new PrismaClient();

const CURRENT_USER_ID = (await prisma.user.findFirst({ where: { name: "Sateesh" } })).id;

const Comment_Select_Fields = {
    id: true,
    message: true,
    parentId: true,
    createdAt: true,
    user: {
        select: {
            id: true,
            name: true
        }
    }
}


app.get("/posts", async (req, res) => {
    return await commitToDb(prisma.post.findMany({
        select: {
            id: true,
            title: true
        }
    }))
})


app.get("/posts/:id", async (req, res) => {
    return await commitToDb(prisma.post.findUnique({
        where: { id: req.params.id },
        select: {
            body: true,
            title: true,
            comments: {
                orderBy: {
                    createdAt: "desc"
                },
                select:
                {
                    ...Comment_Select_Fields,
                    _count: { select: { likes: true } },
                },
            },
        }
    }).then(async post => {
        const likes = await prisma.like.findMany({
            where: {
                userId: req.cookies.userId,
                commentID: { in: post.comments.map(comment => comment.id) }
            }
        })

        return {
            ...post,
            comments: post.comments.map(comment => {
                const { _count, ...Comment_Select_Fields } = comment

                return {
                    ...Comment_Select_Fields,
                    likedByMe: likes.find(like => like.commentID === comment.id),
                    likeCount: _count.likes
                }
            })
        }
    })
    )
})

app.post("/posts/:id/comments", async (req, res) => {
    if (req.body.message === "" || req.body.message === null) {
        return res.send(app.httpErrors.badRequest("Message is Required"))
    }

    return await commitToDb(
        prisma.comment.create({
            data: {
                message: req.body.message,
                userId: req.cookies.userId,
                parentId: req.body.parentId,
                postId: req.params.id
            },
            select: Comment_Select_Fields
        }).then(comment => {
            return {
                ...comment,
                likeCount: 0,
                likeByMe: false
            }
        })
    )
})

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
    if (req.body.message === "" || req.body.message === null) {
        return res.send(app.httpErrors.badRequest("Message is Required"))
    }

    const { userId } = await prisma.comment.findUnique({
        where: { id: req.params.commentId },
        select: { userId: true }
    })

    if (userId !== req.cookies.userId) {
        return res.send(app.httpErrors.unauthorized("You do not have permission to edit this message"))
    }

    return await commitToDb(
        prisma.comment.update({
            where: { id: req.params.commentId },
            data: {
                message: req.body.message
            },
            select: { message: true }
        })
    )
})

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {

    const { userId } = await prisma.comment.findUnique({
        where: { id: req.params.commentId },
        select: { userId: true }
    })

    if (userId !== req.cookies.userId) {
        return res.send(app.httpErrors.unauthorized("You do not have permission to edit this message"))
    }

    return await commitToDb(
        prisma.comment.delete({
            where: { id: req.params.commentId },
            select: { id: true }
        })
    )
})

app.post("/posts/:postId/comments/:commentId/toggleLike", async (req, res) => {
    const data = {
        userId: req.cookies.userId,
        commentID: req.params.commentId       
    }

    const like = await prisma.like.findUnique({
        where: { userId_commentID: data }
    })

    if (like == null) {
        return await commitToDb(prisma.like.create({ data })).then(() => {
            return { addLike: true }
        })
    }
    else {
        return await commitToDb(prisma.like.delete({ where: { userId_commentID: data } })).then(() => {
            return { addLike: false }
        })
    }
})

async function commitToDb(promise) {
    const [error, data] = await app.to(promise);
    if (error)
        return app.httpErrors.internalServerError(error.message);

    return data;
}

app.listen({ port: process.env.PORT })