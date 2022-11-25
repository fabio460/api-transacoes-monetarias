export function handleDate(date:Date) {
    
    return {
        day: date.getDate(),
        month: date.getMonth(),
        hours: date.getHours(),
        minutes:date.getMinutes(),
        year:date.getFullYear()
    }
}