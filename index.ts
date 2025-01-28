#!/usr/bin/env node

import { exec } from "child_process";
import { ChatGPTAPI } from "chatgpt";
import fs from "fs";
import readline from "readline";

const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY as string
})

const HEAD_SIZE = 5; // how many lines of context of a file should be passed to chatgpt
const FILE_LIST_CONTEXT = 50; // how many lines of file/folder contents to give as context
const FILE_PROMPT = "Summarize the purpose of `{}` as concisely as possible, in no more than 15 words. Do not give any explanation, just a short description of the file contents and usagel, for example a file called `main.py` with complex Python code should just be summarized as 'Main Python file'. The file in this case is called `{}`; here are the first 10 lines of the contents:\n{}"
const DIRECTORY_PROMPT = "Summarize the purpose of the directory `{}` as concisely as possible, in no more than 15 words. Do not give any explanation, just a short description of the directory contents and purpose, for example a folder called `bin` with various binaries should just be summarized as 'Binaries of various purposes'. The current folder is `{}`, and the target folder to summarize is called `{}`; here are the first 50 lines of the contents:\n{}"


async function prompt(text: string) {
    const res = await api.sendMessage(text);
    return res.text;
}
// https://stackoverflow.com/a/72265631
async function fileHead(path: string) {
    let output = "";
    
    const inputStream = fs.createReadStream(path);
    let i = 0;
    try {
        for await (const line of readline.createInterface(inputStream)) {
            output += line;
            if (i++ <= HEAD_SIZE) {
                output += line + '\n';
            } else {
                return output;
            }
        }
        return ''; // If the file is empty.
    }
    finally {
        inputStream.destroy(); // Destroy file stream.
    }
}


if (process.argv[0] == "/usr/bin/bun") process.argv.shift();
if (process.argv.length == 1) process.argv.push(".");


function runCommand(command: string): Promise<string> {
    return new Promise(resolve => {
        exec(command, (_, stdout) => resolve(stdout));
    })
}

(async () => {
    const ls = (await runCommand("ls -l " + process.argv.slice(1).join(" "))).split("\n");
    let directory = process.argv.at(-1) as string;
    if (!directory?.endsWith("/")) directory += "/"
    
    const maxLineLength = Math.max.apply(null, ls.map(line => line.length));

    // for each file
    for (let line of ls.splice(1)) {
        const filename = line.split(/ +/).slice(8).join(" ");
        if (!filename) continue;

        const fileStats = fs.statSync(directory + filename);
        let summary;
        if (fileStats.isFile()) {
            summary = await prompt(FILE_PROMPT.replace("{}", filename).replace("{}", filename).replace("{}", await fileHead(directory + filename)));
        } else if (fileStats.isDirectory()) {
            summary = await prompt(DIRECTORY_PROMPT.replace("{}", directory + filename).replace("{}", directory).replace("{}", directory + filename).replace("{}", ls.splice(0, FILE_LIST_CONTEXT).join("\n")));
        } else {
            continue;
        }

        console.log(line + " ".repeat(maxLineLength - line.length), "-", summary)
    }
})();