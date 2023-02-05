#!/usr/bin/env node
import chalk from 'chalk';
import {exec} from "child_process"
let args = process.argv.slice(2);


const commandAction = (params) => {
    const name = params[0]
    const re = new RegExp("^[a-zA-Z0-9]+$", "g")
    if (re.test(name)) {
        exec(`mkdir ${name}`,(err,stdout,stderr)=>{
            console.log({err,stdout,stderr});
        });
    } else {
        console.log(chalk.red('Entered Name is not Valid. Please put valid name.'));
    }
}

commandAction(args)