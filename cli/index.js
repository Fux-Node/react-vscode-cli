#!/usr/bin/env node
import chalk from 'chalk';
import { exec } from "child_process"
let args = process.argv.slice(2);
import fs from "fs";
import path from "path"
import fetch from "node-fetch"
import editJsonFile from "edit-json-file";


const ignoreFileandFolders = [
    ".github",
    "node_modules",
    "build",
    ".codesandbox"
]

const checkIfignored = (name) => {
    if (ignoreFileandFolders.findIndex(i => i === name) === -1) {
        return false;
    }
    return true;
}

async function downloadFile(url, filePath) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    const dest = fs.createWriteStream(filePath);
    response.body.pipe(dest);
    return new Promise((resolve, reject) => {
        dest.on('finish', resolve);
        dest.on('error', reject);
    });
}

async function cloneRepoFromGitHub(url, repo, dest) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw `Failed to Create Project. Please Report Issues in https://github.com/Fux-Node/react-vscode-framework/issues/`;
        }

        const contents = await response.json();

        for (const item of contents) {
            if (checkIfignored(item.name)) continue;

            if (item.type === 'file') {
                const fileUrl = item.download_url;
                const filePath = path.join(dest, item.name);

                if (filePath.toLowerCase().endsWith(".png") || filePath.toLowerCase().endsWith(".jpg") || filePath.toLowerCase().endsWith(".jpeg")) {
                    await downloadFile(fileUrl, filePath)
                    console.log(chalk.blue(`File Created ${item.name}`))
                } else {
                    const fileResponse = await fetch(fileUrl);
                    const fileContents = await fileResponse.text();
                    fs.writeFileSync(filePath, fileContents);
                    console.log(chalk.blue(`File Created ${item.name}`))
                }
            }

            if (item.type === 'dir') {
                const dirPath = path.join(dest, item.name);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdir(dirPath, { recursive: true }, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                }
                await cloneRepoFromGitHub(item.url, repo, dirPath);
            }
        }
    } catch (error) {
        throw error
    }
}

const mainUrl = {
    owner: 'Fux-Node',
    repo: 'react-vscode-framework',
    url: `https://api.github.com/repos/Fux-Node/react-vscode-framework/contents?ref=main`
}

const devUrl = {
    owner: 'Fux-Node',
    repo: 'react-vscode-framework',
    url: `https://api.github.com/repos/Fux-Node/react-vscode-framework/contents?ref=dev`
}

const changeJsonFileName = (dest, name) => {
    let file = editJsonFile(dest);
    file.set("name", name)
    file.set("publisher", name)
    file.save()
}

const commandAction = (params) => {
    const name = params[0]
    const isDev = params.includes("--dev")
    const re = new RegExp("^[a-zA-Z0-9]+$", "g")
    if (name && re.test(name)) {
        exec(`mkdir ${name}`, async (err, stdout, stderr) => {
            if (err) return console.log(chalk.red(err));
            const destination = path.join(process.cwd(), name)
            try {
                const userChoice = isDev ? devUrl : mainUrl
                // const userChoice = mainUrl;
                await cloneRepoFromGitHub(userChoice.url, userChoice.repo, destination);
                const destOfPackage = path.join(destination, "package.json");
                changeJsonFileName(destOfPackage, name);
                console.log(chalk.green("Congrats !!! React-Vscode-Framework Created Successfully."))
                console.log(chalk.yellowBright("visit : https://fuxnode.com/docs"))
            } catch (error) {
                console.log(chalk.red(error));
            }
        });
    } else {
        console.log(chalk.red('ERROR : Entered Name is not Valid. Please put valid name.'));
    }
}

commandAction(args)