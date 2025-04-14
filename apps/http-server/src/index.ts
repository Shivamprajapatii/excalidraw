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
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect Input"
        })
        return;
    }
    const { email, photo, name, password } = req.body;

    const findUser = prismaClient.user.findUnique({
        where: email
    });

    const hashPassowrd = await bcrypt.hash(password, 10);

    if (!findUser) {
        const user = await prismaClient.user.create({
            data: {
                email,
                name,
                photo,
                password: hashPassowrd
            },
        });
    }
    else {
        res.json({ message: "User already Exists" });
    };

    res.json({
        message: "User Signup Successfull!"
    });
});

app.post("/signin", async (req: Request, res: Response) => {
    const data = SignInSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect Input"
        })
        return;
    }

    const { email, password } = req.body;

    const user = await prismaClient.user.findFirst({
        where :{
            email
        }
    });

    //@ts-ignore
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!user) {
        res.status(400).json({
            message: "Wront Details or User Not Exist"
        })
    };

    const token = jwt.sign({
        //@ts-ignore
        userId: user.id
    }, JWT_SECRET);

    res.json({
        message: "User Signin successful",
        token
    });
});

app.post("/room", middleware, (req, res) => {
    const data = CreateRommSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Wrong Details Input!"
        });
        return;
    };
    //db call
    res.json({
        roomId: 123
    });

});

app.listen(4000, () => {
    console.log("Server is Listining on Port 4000");
});