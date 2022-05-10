// Middleware - se meu usuario nao estiver autenticado, precisamos que retorne um erro, mas se o usuario estiver autenticado, usamos o next para dar sequencia

import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export function ensureAuthentication(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization

    if(!authToken) {
        return response.status(401).json({ 
            errorCode: "token.invalid"
        })
    }

    // Bearer 91231927hasdas9g702hja2
    // [0] Bearer
    // [1] 91231927hasdas9g702hja2
    const [, token] = authToken.split(" ")

    try { 
        // sub - id do usuario
        const { sub } = verify(token, process.env.JWT_SECRET) as IPayload

        // Esta dando erro, entao precisamos sobreescrever a tipagem do express (pasta @types -> express)
        request.user_id = sub

        // repassar o middleware pra frente
        return next();
    } catch(err) {
        return response.status(401).json({errorCode: "token.expired"})
    }
    
}