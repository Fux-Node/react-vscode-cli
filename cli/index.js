#!/usr/bin/env node
let args = process.argv.slice(2);

const commandAction = (params) => {
    return new Promise((res,rej)=>{
        setTimeout(()=>{rej("success")},7000)
    })
}




commandAction(args).then(()=>clearInterval(startPrint)).catch((err)=>console.warn("error"))