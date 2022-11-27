import { PrismaClient } from "@prisma/client"
import { listAccountsType, listByDateType, transactionsType } from "./Types";

const prisma = new PrismaClient()

export function handleDate(date:Date) {
    
    return {
        day: date.getDate(),
        month: date.getMonth(),
        hours: date.getHours(),
        minutes:date.getMinutes(),
        year:date.getFullYear()
    }
}

export async function getTransactionsAll(id:number) {
    return await prisma.transactions.findMany({
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
}

export async function getTransactionsDebiteds(id:number) {
    return await prisma.transactions.findMany({
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
}

export async function getTransactionsCrediteds(id:number) {
    return await prisma.transactions.findMany({
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
}


export function getListByDate(arrayAux:any,day:number,month:number,year:number) {
    var listByDate:any = []

    listByDate = arrayAux.map((e:transactionsType)=>{
        let date =new Date(e.createdAt)
        return {
            obj:e,
            date: handleDate(date)
        }
    })

    return listByDate.filter((obj:listByDateType)=>{
        if (obj.date.day === day && obj.date.month === month && obj.date.year === year) {
            return obj
        }
    })
    
}