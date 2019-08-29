# Maven repository cli test

[![Build Status](https://travis-ci.org/clemstoquart/maven-repo-cli.svg?branch=master)](https://travis-ci.org/clemstoquart/maven-repo-cli)

## Requirements

Nodejs 12 is required.

## Setup

    yarn install
    
## Build

Sources are written in typescript so a compilation step is required :

    yarn build

Compiled to javascript files are available in the `lib` folder.

## Usage

You can see all available commands running :

    node lib/index.js -help

For example :

    node lib/index.js checkPom ~/projects/my-project/pom.xml

## Lint

Lint step is provided by ESLint :

    yarn lint
