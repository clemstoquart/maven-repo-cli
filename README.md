# Maven repository cli

## Requirements

Nodejs 20 and Yarn 1.22+ are required.

## Setup

    yarn install

### Editor setup

For VSCode : https://yarnpkg.com/getting-started/editor-sdks#vscode

## Build

Sources are written in typescript so a compilation step is required :

    yarn build

Compiled to javascript files are available in the `lib` folder.

## Usage

You can see all available commands running :

    yarn node lib/index.js --help

For example :

    yarn node lib/index.js checkPom ~/projects/my-project/pom.xml

## Lint

Lint step is provided by ESLint :

    yarn lint
