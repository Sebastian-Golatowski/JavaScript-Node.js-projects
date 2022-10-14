import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async  (req, res) =>{
    let {login, password} = req.body;

    const find = await prisma.user.findFirst({
        where: {
          login : login
        },
    })

    if(find != null){
        res.status(200).send('login already in use');
        return null
    }
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    const create = await prisma.user.create({
        data:{
            login: login,
            password : hash
        }
    });

    res.status(201).send();
    
}

export const login = async  (req, res) =>{
    let {login, password} = req.body;

    const find = await prisma.user.findFirst({
        where: {
          login : login
        },
    })


    if(find == null){
        res.status(401).send();
        return null
    }
    else {
        bcrypt.compare(password, find.password, (err,data) => {
            if (data) {
                let token = jwt.sign({ id: find.id }, 'token-kod-leci');
                res.status(200).send(token)
            } else {
                res.status(401).send();
            }
        })
    }
}

export const logout = async  (req, res) =>{
    
}
