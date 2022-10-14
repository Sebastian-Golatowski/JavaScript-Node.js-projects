import { PrismaClient } from '@prisma/client';
import emailValidator from "deep-email-validator";
import nodemailer from "nodemailer";

const prisma = new PrismaClient()


const isEmailValid = async(email) => {
    return emailValidator.validate(email)
}

const sendMail = async (userMail, id) => {
    let find = await prisma.user.findFirst({
        where:{
            email : userMail,
            id : Number(id)
        }
    })

    if(find == null)  return res.status(400).send('no such account');

    let mail = "paris98@ethereal.email";
    let mailTrans = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: mail,
            pass: "2fdyZKnsYdmw9rPT5K"
        }
    })

    let info = await mailTrans.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: `${userMail}`, 
        subject: 'email validation', 
        html: `<a href='http://localhost:5000/api/users/valid/${id}'>Click here</a>`, 
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

export const checksVerified = async (req, res)=>{
    let {usId} = req.params;

    let {email, verif} = await prisma.user.findFirst({
        where:{
            id : Number(usId)
        }
    })

    let status = (verif === true) ? res.status(200).send(`user with email: ${email} is verified`) : res.status(202).send(`user with email: ${email} is not verified`)
}


export const addAccount = async(req, res)=>{
    let {email} = req.body;

    // const {valid, reason, validators} = await isEmailValid(email);

    // if(!valid){
    //     return res.status(400).send({
    //         message: "Please provide a valid email address.",
    //         reason: validators[reason].reason
    //       })
    // }
    let find = await prisma.user.findFirst({
        where:{
            email:email
        }
    })
    
    if(find != null) return res.status(400).send('email already in use') ;

    let add = await prisma.user.create({
        data:{
            email: email
        }
    })

    sendMail(email, add.id)

    res.status(200).send(`verification email sended to ${email}`)
}

export const validateAccount = async (req, res)=>{
    const {usId} = req.params;

    let find = await prisma.user.findFirst({
        where:{
            id : Number(usId)
        }
    })

    if(find == null) return res.status(400).send('there is no account with this id')
    
    let valid = await prisma.user.update({
        where:{
            id: Number(usId)
        },
        data:{
            verif: true
        }
    })
    res.status(200).send(`User with id: ${usId} verified`)
}

export const sendAgain = async (req, res) =>{
    let {usId} = req.params
    let {verif, email} = await prisma.user.findFirst({
        where:{
            id : Number(usId)
        }
    })

    if(verif == true) return res.status(202).send('account already verified')

    sendMail(email, usId)

    res.status(200).send(`verification email sent to ${email}`)

}
