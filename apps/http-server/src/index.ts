import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcrypt";
import { CreateUserSchema, SignInSchema, CreateRommSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { middleware } from "./middleware";


const app = express();
app.use(express.json());


app.post("/signup", async (req: Request, res: Response) => {
    try {
        const parseData = CreateUserSchema.safeParse(req.body);

        if (!parseData.success) {
            res.json({
                message: "Incorrect Input"
            })
            return;
        }
        const responce = await prismaClient.user.findFirst({
            where: {
                email: parseData.data.email
            }
        });

        if (responce) {
            res.json({
                message: "User already exists with this email"
            });
            return;
        };

        const hashPassowrd = await bcrypt.hash(parseData.data.password, 10);

        const user = await prismaClient.user.create({
            data: {
                email: parseData.data.email,
                name: parseData.data.username,
                password: hashPassowrd
            }
        });
        res.json({
            message: "User Signup Successfull!",
            user
        })

    } catch (error) {
        res.json({
            message: "Error Occur while signup",
            error
        })
    };

});

app.post("/signin", async (req: Request, res: Response) => {
    try {

        const parseData = SignInSchema.safeParse(req.body);

        if (!parseData.success) {
            res.json({
                message: "Incorrect Input"
            })
            return;
        }

        const user = await prismaClient.user.findFirst({
            where: {
                email: parseData.data.email,
            }
        });

        if (!user) {
            res.json({
                message: "User not Exists or Wrong Details"
            })
            return;
        }
        //@ts-ignore
        const checkPassword = await bcrypt.compare(parseData.data.password, user.password);

        if (!checkPassword) {
            res.status(400).json({
                message: "Wront Details or User Not Exist"
            })
            return;
        };

        const token = jwt.sign({
            userId: user?.id
        }, JWT_SECRET);

        res.json({
            message: "User Signin successful",
            token
        });

    } catch (error) {
        res.json({
            message: "Error While SignIn",
            error
        })
    }
});

app.post("/room", middleware, async (req, res) => {

    const parseData = CreateRommSchema.safeParse(req.body);
    if (!parseData.success) {
        res.json({
            message: "Wrong Details Input!"
        });
        return;
    };
    //@ts-ignores
    const userId = req.userId;
    try {
        const roomData = await prismaClient.room.create({
            data: {
                slug: parseData.data.name,
                adminId: userId
            }
        });

        res.json({
            roomId: roomData.id
        });

    } catch (error) {
        res.status(411).json({
            message: "Room already exists with this name",
            error
        })
    };

});

app.get("/chats/:roomId", async (req, res) =>{
    try {
        const roomId = Number(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
        where : {
            roomId : roomId
        },
        orderBy : {
            id : "desc"
        },
        take : 1000
    });
    res.json({
        messages
    })
    } catch (error) {
      res.json({
        error
      })  
    } 
});

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where : {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(4000, () => {
    console.log("Server is Listining on Port 4000");
});