import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { Request, Response } from "express"
import { getListByDate, getTransactionsAll, getTransactionsCrediteds, getTransactionsDebiteds, handleDate } from "../uteis"


export const getAccount =async (req:Request,res:Response)=>{
    const account = await prisma.accounts.findUnique({
        where:{
            id:req.body.id 
        },
        include:{
            creditedAccount:true,
            debitedAccount:true,
            _count:true
        }
    })
    res.json(account)
}

export const cashOut =async (req:Request,res:Response)=>{
   const {id,value,userCashIn} = req.body
    
   try {
        const userIn = await prisma.users.findUnique({
            where:{
                username:userCashIn
            }
        })    
        const accountIn =await prisma.accounts.findUnique({
            where:{
                id:userIn?.id
            },
        }) 
        const balanceIn = accountIn?.balance ?? 0
        const accountOut = await prisma.accounts.findUnique({
            where:{
                id
            }
        })
        const balanceOut = accountOut?.balance ?? 0
        if (userIn) {
            if (value <= balanceOut) {
                if (userIn.id === id) {
                    res.send('você não pode enviar dinheiro para si mesmo')
                } else {
                    const newBalanceIn = balanceIn + value
                    const newBalanceOut = balanceOut - value
                    await prisma.accounts.update({
                        where:{
                        id:userIn.id
                        },
                        data:{
                        balance:newBalanceIn
                        }
                    })
                    await prisma.accounts.update({
                        where:{
                        id
                        },
                        data:{
                        balance:newBalanceOut
                        }
                    })
                    await prisma.transactions.create({
                        data:{
                            creditedAccountId:userIn.id,
                            debitedAccountId:id,
                            value
                        }
                    })
                    res.json("enviado o valor de R$ "+value.toFixed(2)+" para "+ userIn?.username+" seu novo saldo é: R$ "+newBalanceOut.toFixed(2)+".")            
                }
            } else {
                res.json('saldo insuficiente')
            }        
        } 
   } catch (error) {
    res.json('Usuário não encontrado ou dados incorretos!')
   }
}

export const getTransactions=async (req:Request,res:Response)=>{
    const {id,selectedBy,day,month,year} = req.body
    var transaction = null
    switch (selectedBy) {
        case "c":
            let arrayAux = []

            arrayAux = await getTransactionsCrediteds(id)
            transaction = getListByDate(arrayAux,day,month,year)
            break;

        case "d":
            arrayAux =await getTransactionsDebiteds(id)
            transaction = getListByDate(arrayAux,day,month,year)
            break;  
             
        default:
            arrayAux =await getTransactionsAll(id)
            transaction = getListByDate(arrayAux,day,month,year)
            break;    
    }
    
    res.json(transaction)
}

