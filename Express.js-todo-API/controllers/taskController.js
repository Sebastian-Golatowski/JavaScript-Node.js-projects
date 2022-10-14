import { PrismaClient } from '@prisma/client'

import jwt from "jsonwebtoken";

const prisma = new PrismaClient()

const getUserId = (tok) =>{
    const {id} = jwt.verify(tok,'token-kod-leci');

    return id
}

const get = async (id) =>{
    const tasks = await prisma.task.findMany({
        where:{
            userid:Number(id)
        }
    });

    return tasks;
}

export const getTasks = async (req, res) =>{
    let token = req.headers['authorization']
    let id = getUserId(token)

    let tasks = await get(id);

    res.status(200).send(tasks)
    // res.status(200).send(`${id}`)
}

export const creTasks = async (req, res) =>{
    let token = req.headers['authorization']
    let id = getUserId(token)

    let {text, day, reminder} = req.body;

    reminder = reminder == 1 ? true : false;


    const make = await prisma.task.create({       
            data:{
            text: text,
            userid: Number(id),
            day: String(day),
            reminder: Boolean(reminder)
        }
    })

    let tasks = await get(id)

    res.status(201).send(tasks);
}

export const delTasks = async (req, res) =>{
    const {id} = req.params;

    const del = await prisma.task.delete({
        where:{
            id : Number(id)
        }
    })

    res.status(200).send()
}

export const toggleRem = async (req, res) =>{
    const {id} = req.params;

    const find = await prisma.task.findFirst({
        where: {
          id: Number(id)
        },
    })

    let toggle = find.reminder == 1 ? false : true;

    const change = await prisma.task.update({
        where: {
          id: Number(id)
        },
        data: {
            reminder: toggle
        },
    })

    // UPDATE task set data = toggle where id = id

    res.status(200).send()
}

