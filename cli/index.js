#!/usr/bin/env node
import chalk from 'chalk';
import { exec } from "child_process"
let args = process.argv.slice(2);
import { loading } from 'cli-loading-animation';
import cliSpinners from 'cli-spinners';

const createLoader = () => {
    const withName = (name) => {
        const { start, stop } = loading(chalk.blue(name), { spinner: cliSpinners.bluePulse })
        withName.stopLoad = stop;
        start()
    }
    return {
        loadWithName: withName,
    }
}


const commandAction = (params) => {
    const name = params[0]
    const re = new RegExp("^[a-zA-Z0-9]+$", "g")
    const { loadWithName } = createLoader()
    if (name && re.test(name)) {
        loadWithName(`Creating File ${name}`)
        exec(`mkdir ${name}`, (err, stdout, stderr) => {
            loadWithName.stopLoad()
            if (err) return console.log(chalk.red(err));
            loadWithName(`Creating package.json file`)
            exec(`cd ${name} && npm init -y`, (err, stdout, stderr) => {
                setTimeout(() => loadWithName.stopLoad(), 3000)
            })
        });
    } else {
        console.log(chalk.red('ERROR : Entered Name is not Valid. Please put valid name.'));
    }
}

commandAction(args)