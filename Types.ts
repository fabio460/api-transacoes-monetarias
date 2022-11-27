export interface listByDateType{
    date:{
     day:number,
     month:number,
     year:number
    },
 }

 export interface listAccountsType{
    id: number,
    creditedAccount: {
         id: number,
         user: {
             username: string,
         } | null,
    },
    debitedAccount: {
         id: number,
         user: { 
            username: string, 
        } | null,
    },

    createdAt: Date,
    date:{
        day:number,
        month:number,
        year:number
    },
 }[]

export  interface transactionsType{
    createdAt:Date
}

 export interface t{
    value: { obj: { createdAt: Date; }; date: { day: number; month: number; hours: number; minutes: number; year: number; }; }, index: number, array: { obj: { createdAt: Date; }; date: { day: number; month: number; hours: number; minutes: number; year: number; }; }[] 

}