#!/usr/bin/env node
'use strict';

const program = require('commander');
const mavenCentralClient = require('./mavenCentralClient');
const pomParser = require('./pomReader');

program
    .version('1.0.0')
    .description('Maven central cli');

program
    .command('check <groupId> <arctifactId>')
    .description('Check arctifact version')
    .action((groupId, arctifactId) => mavenCentralClient.getDependencyVersion(groupId, arctifactId).then(version => console.log(version)));

program
    .command('checkPom <pomPath>')
    .description('Check all artifacts and report outdated ones')
    .action(pomPath => pomParser.readAndProduceReport(pomPath));

program.parse(process.argv);
