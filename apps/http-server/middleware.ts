import { NextFunction, Request, Response} from "express";
import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";


export function Middleware(req : Request, res : Response, next : NextFunction) {
    try {
        
        const token = req.headers["authorization"] ?? "";

    const decode = jwt.verify(token, JWT_SECRET) as {userId : String};

    if(decode){
        "@tsignore"
        res.locals.userId = decode.userId
    }
    else {
        res.status(403).json({
            message : "Unauthorized Access"
        })
    }

    next(); 

    } catch (error) {
        res.send.json({
            
        })
    }
}
