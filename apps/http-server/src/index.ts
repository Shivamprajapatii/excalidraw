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
        where : {
            email : parseData.data.email
        }
    });

    if(responce){
        res.json({
            message : "User already exists with this email"
        });
        return ;
    };

    const hashPassowrd = await bcrypt.hash(parseData.data.password, 10);

    const user = await prismaClient.user.create({
        data: {
            email : parseData.data.email,
            name : parseData.data.username,
            password: hashPassowrd
        }
    });
    res.json({
        message : "User Signup Successfull!",
        user
    })

    } catch (error) {
        res.json({
            message : "Error Occur while signup",
            error
        })
    };
    
});

app.post("/signin", async (req: Request, res: Response) => {
    const parseData = SignInSchema.safeParse(req.body);
    console.log(parseData);

    if (!parseData.success) {
        res.json({
            message: "Incorrect Input"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where :{
            name : parseData.data.username
        }
    });

    if(!user){
        res.json({
            message : "User not Exists or Wrong Details"
        })
        return;
    }
    //@ts-ignore
    const checkPassword = await bcrypt.compare(parseData.data.password, user.password);

    if (!checkPassword) {
        res.status(400).json({
            message: "Wront Details or User Not Exist"
        })
        return ;
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