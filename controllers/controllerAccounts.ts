import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { Request, Response } from "express"
import { handleDate } from "../uteis"

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
    const {id,value,userCashOut,userCashIn} = req.body
    
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
                const updateIn = await prisma.accounts.update({
                    where:{
                      id:userIn.id
                    },
                    data:{
                      balance:newBalanceIn
                    }
                })
                const updateOut = await prisma.accounts.update({
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
                res.json("enviado o valor de "+value.toFixed(2)+" reais para "+ userIn?.username+" seu novo saldo é: "+newBalanceOut.toFixed(2)+" reais.")            
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
            let aux = []
            let listByDate = []
            aux = await prisma.transactions.findMany({
                    where:{
                        
                       OR:[
                        {
                            creditedAccountId:id
                        },
                        {
                            debitedAccountId:id
                        }
                       ],
                       AND:[
                        {
                            creditedAccount:{
                                id:{
                                    equals:id
                                }
                            }
                        }
                       ]
                    },
                    select:{
                        id:true,
                        createdAt:true,
                        value:true,
                        debitedAccount:{
                            select:{
                                id:true,
                                balance:false,
                                user:{
                                    select:{
                                        username:true
                                    }
                                }
                            }
                        },
                        creditedAccount:{
                            select:{
                                id:true,
                                balance:false,
                                user:{
                                    select:{
                                        username:true
                                    }
                                }
                            }
                        }
                    },

                })
                    listByDate = aux.map(e=>{
                    let date =new Date(e.createdAt)
                    return {
                        obj:e,
                        date:handleDate(date)
                    }
                })
                transaction = listByDate.filter(obj=>{
                    if (day) {
                      if (obj.date.day === day && obj.date.month === month && obj.date.year === year) {
                          return obj
                      }
                    } else {
                      return obj
                    }
                  })
            
            break;
        case "d":
            aux = await prisma.transactions.findMany({
                where:{
                   OR:[
                    {
                        creditedAccountId:id
                    },
                    {
                        debitedAccountId:id
                    }
                   ],
                   AND:[
                    {
                        debitedAccount:{
                            id:{
                                equals:id
                            }
                        }
                    }
                   ]
                },
                select:{
                    id:true,
                    createdAt:true,
                    value:true,
                    debitedAccount:{
                        select:{
                            id:true,
                            balance:false,
                            user:{
                                select:{
                                    username:true
                                }
                            }
                        }
                    },
                    creditedAccount:{
                        select:{
                            id:true,
                            balance:false,
                            user:{
                                select:{
                                    username:true
                                }
                            }
                        }
                    }
                }
            })
             listByDate = aux.map(e=>{
                let date =new Date(e.createdAt)
                return {
                    obj:e,
                    date: handleDate(date)
                }
            })
            transaction = listByDate.filter(obj=>{
                if (day) {
                  if (obj.date.day === day && obj.date.month === month && obj.date.year === year) {
                      return obj
                  }
                } else {
                  return obj
                }
              })
            break;  
                 
        default:
            aux = await prisma.transactions.findMany({
                where:{
                   OR:[
                    {
                        creditedAccountId:id
                    },
                    {
                        debitedAccountId:id
                    }
                   ],
                
                },
                select:{
                    id:true,
                    createdAt:true,
                    value:true,
                    debitedAccount:{
                        select:{
                            id:true,
                            balance:false,
                            user:{
                                select:{
                                    username:true
                                }
                            }
                        }
                    },
                    creditedAccount:{
                        select:{
                            id:true,
                            balance:false,
                            user:{
                                select:{
                                    username:true
                                }
                            }
                        }
                    }
                }
            })
             
                listByDate = aux.map(e=>{
                let date =new Date(e.createdAt)
                return {
                    obj:e,
                    date: handleDate(date)
                }
            })
            transaction = listByDate.filter(obj=>{
              if (day && month && year) {
                if (obj.date.day === day && obj.date.month === month && obj.date.year === year) {
                    return obj
                }
              } else {
                return obj
              }
            })
            break;    

            
    }
    
    var dates = transaction

    setTimeout(() => {
        res.json(dates)
    }, 300);
}

export const trans =async (req:Request,res:Response)=>{
    const a = await prisma.transactions.findMany()

    res.json(a)
}