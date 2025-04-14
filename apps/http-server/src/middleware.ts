import { NextFunction, Request, Response} from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";


export function Middleware(req : Request, res : Response, next : NextFunction) {
    try {
        
        const token = req.headers["authorization"] ?? "";
        const decode = jwt.verify(token, JWT_SECRET);

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
        res.send({
            error :"Erorro found"
        })
    }
}
