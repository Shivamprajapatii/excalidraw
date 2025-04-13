import {express, Request, Response} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
const app = express();


app.use(express.json());


app.post("/signup", (req: Request, res : Response) => {
    const {username, email, password } = req.body;

    const findUser = new UserModel.findOne({
        email
    });

    const hashPassowrd = bcrypt.hash(password,10);

    if(!findUser){
        const data = new UserModel.create({
            username,
            email,
            hashPassowrd
        });
    
    }
    else {
        res.json({message : "User already Exists"});
    };

    res.json({
        message :"User Signup Successfull!"
    });
});

app.post("/signin", (req : Request, res : Response ) => {
    const {username, password } = req.body;
    

    const user = new UserModel.find({
        username,
    });

    const checkPassword = bcrypt.compare(password, user.password );

    if(!user){
        res.status(400).json({
            message: "Wront Details or User Not Exist"
        })
    };

    const token = jwt.sign({
        id : user.id
    }, JWT_SECRET);

    res.json({
        message : "User Signin successful",
        token
    });
});

app.listen(4000, () => {
    console.log("Server is Listining on Port 4000");
});