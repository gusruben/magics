# Magics ✨

Magics is an AI-powered extension of `ls`-- at a glance you can get an idea of the more complex purpose of files and directories. It's powered by OpenAI ChatGPT in the backend, and it gets context on relevant files and directories to make smart summaries of what you're looking at. 

## Installation 🚀

Magics is available [available on the Node Package Registry](https://www.npmjs.com/package/magics-ls)! Install it with:
```
npm install -g magics-ls
```

## Usage 🔧

To use Magics, set your OpenAI API key as such:
```
export OPENAI_API_KEY=sk-proj-...
```

Then, just run `ms` to list the contents of the current directory along with helpful summaries.

### Example 🗒️

```sh
$ ms
total 44
-rwxrwxrwx  1 gusruben users 23926 Jan 27 23:21 bun.lockb     - Lockfile format for dependency management, likely related to package versions and metadata.
-rw-r--r--  1 gusruben users  2468 Jan 27 23:56 index.ts      - TypeScript file defining API interactions, filesystem and command execution using ChatGPT service.
drwxr-xr-x 62 gusruben users  4096 Jan 27 23:21 node_modules  - A list of dependencies for the NodeJS project.
-rw-r--r--  1 gusruben users   226 Jan 27 23:21 package.json  - Configuration file for Node.js projects, specifying metadata, dependencies, and scripts.
-rw-r--r--  1 gusruben users   140 Jan 17 02:26 README.md     - Documentation file providing information, instructions, guidelines, and context for a project or repository.
-rw-r--r--  1 gusruben users   635 Jan 17 02:22 tsconfig.json - TypeScript configuration file specifying compilation options, target version, and other compiler settings.
```

### Demo 📺

![Magics demo](https://raw.githubusercontent.com/gusruben/magics/refs/heads/main/magics.gif)

> GIF not displaying properly? Try viewing the file [here](https://github.com/gusruben/magics/blob/main/magics.gif). 