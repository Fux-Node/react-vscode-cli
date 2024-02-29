#!/usr/bin/env node
import chalk from "chalk";
import { exec } from "child_process";
let args = process.argv.slice(2);
import editJsonFile from "edit-json-file";
import path from "path";
import { loading } from "cli-loading-animation";
import spinners from "cli-spinners";

const changeJsonFileName = (dest, name) => {
  let file = editJsonFile(dest);
  file.set("name", name);
  file.set("publisher", name);
  file.save();
};

const { start, stop } = loading("Please wait while we build the files..", {
  clearOnEnd: true,
  spinner: spinners.line,
});

const commandAction = (params) => {
  const name = params[0];
  const re = new RegExp("^[a-zA-Z0-9]+$", "g");
  if (name && re.test(name)) {
    start();
    exec(
      `git clone --branch v1.0.0 https://github.com/Fux-Node/react-vscode-framework.git ${name}`,
      (err, stdout, stderr) => {
        if (err) {
          stop();
          return console.log(
            chalk.red("something wrong ! contact us : info@fuxnode.com")
          );
        }

        exec(`cd ${name} && npx rimraf .github .git`, (err, stdout, stderr) => {
          if (err) {
            stop();
            return console.log(
              chalk.red("something wrong ! contact us : info@fuxnode.com")
            );
          }
          const destination = path.join(name, "package.json");
          changeJsonFileName(destination, name);
          const destinationlock = path.join(name, "package-lock.json");
          changeJsonFileName(destinationlock, name);

          stop();
          console.log(chalk.blueBright(`cd ${name}`));
          console.log(chalk.blueBright("npm install"));
          console.log(chalk.blueBright("click on F5 or start Debug !"));
          console.log("\n");
          console.log(
            chalk.green(
              "Congrats!!!, React-Vscode-Framework Created Successfully..."
            )
          );
          console.log(chalk.yellowBright("visit : https://fuxnode.com/docs"));
        });
      }
    );
  } else {
    console.log(
      chalk.red("ERROR : Entered Name is not Valid. Please put valid name.")
    );
  }
};

commandAction(args);
