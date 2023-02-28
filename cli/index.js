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

const loadingStop = (loadWithName) => {
    loadWithName.stopLoad()
}

const createUrl = () => {
    let owner = 'microsoft'
    let repo = 'vscode'
    let path = ''
    return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
}

const fileRead = (url = createUrl()) => {
    return new Promise(async (res, rej) => {
        try {
            const data = await fetch(url).then(res => res.json())
            res(data)
        } catch (error) {
            rej(error)
        }
    })
}

const ignoreFileandFolders = [
    ".github",
    "node_modules"
]

const checkIfignored = (name) => {
    if (ignoreFileandFolders.findIndex(i => i === name) === -1) {
        return false;
    }
    return true;
}

let fileObj = {}
const createFileandFolder = (data) => {
    data.map(item => {
        if (item.type === "dir") {
            if (checkIfignored(item.name)) return;

        } else if (item.type === "file") {

        }
    })
}

const invokeFiles = (url) => {
    fileRead(url).then((data) => {
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
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
            exec(`cd ${name}`, (err, stdout, stderr) => {
                setTimeout(() => loadingStop(loadWithName), 1000)
            })
        });
    } else {
        console.log(chalk.red('ERROR : Entered Name is not Valid. Please put valid name.'));
    }
}

commandAction(args)