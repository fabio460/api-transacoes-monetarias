import {PrismaClient} from '@prisma/client'
import {Request,Response} from 'express';
import Jwt from 'jsonwebtoken'

import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient()


export const setUsers =async (req:Request,res:Response)=>{
    const {username,password} = req.body
    const haveNumber = /[0-9]/;
    const haveUpperCase = /[A-Z]/
    const minimumThreeCaracter = /.{3}/
    const minimumOctorCaracter = /.{8}/

    async function main() {  
        if (!minimumThreeCaracter.test(username)) {
            return res.json('O usuário tem que ter pelo menos 3 caracter')
        } else{
            if (!minimumOctorCaracter.test(password) || !haveNumber.test(password) || !haveUpperCase.test(password)) {
                return res.json("A senha tem que ter no mínimo 8 caracteres, no mínimo 1 maiúsculo e pelo menos 1 número")
            } else {
               try {
                const userCreated = await  prisma.users.create({
                        data:{
                            username,
                            password: bcrypt.hashSync(password, 10),
                            accounts:{
                                create:{
                                    balance:100,
                                }
                            }
                        }
                    })
                
                return res.json("Usuário "+userCreated.username+" cadastrado com sucesso!")  
               } catch (error) {
                return res.json('Este usuário já existe')  
               }              
            }
        }
      }
        return main()
}

export const getUsers =async (req:Request,res:Response)=>{  
   try {
    const user =await prisma.accounts.findMany({
        select:{
         
         user:{
             select:{
                 id:true,
                 username:true
             }
         }
        }
     })
     return res.json(user)
   } catch (error) {
     res.json(error)
   }
}

export const getUser =async (req:Request,res:Response)=>{
   try {
    const {id} = req.body  
    const user =await prisma.users.findUnique({
        where:{
            id
        },
        select:{
            id:true,
            username:true
        }
    })
    return res.json(user)
   } catch (error) {
    res.json(error)
   }
}

export const login = async (req:Request,res:Response)=>{
    const {username,password} = req.body  
    const user = await prisma.users.findUnique({
     where:{
         username,
     }
    })
    if (bcrypt.compareSync(password,user?.password??'')) {
     const auth =  Jwt.sign({id:user?.id},process.env.SECRETKEY??'',{expiresIn:'24h'})
     res.json({
         usuario:user?.id,
         JWT:auth
        })    
    } else {
     res.json(null)
    }
}

export const accessVerify =async (req:Request,res:Response,next:any)=>{
    try {
        const token = req.headers['x-access-token'] as ''
        const tokenValid = Jwt.verify(token,process.env.SECRETKEY??'')
        const account = await prisma.accounts.findUnique({
            where:{
                id:req.body.id 
            }
        })
        const idAccount = account?.id
        const tokenValidAtString = JSON.stringify(tokenValid)
        const idTokenValid = JSON.parse(tokenValidAtString).id
        if (idAccount === idTokenValid) {
            return next() 
        }else{
            return res.json('não autenticado')
        }     
        
    } catch (error) { 
        res.json(null)
    }
}

