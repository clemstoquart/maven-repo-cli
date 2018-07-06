#!/usr/bin/env node
'use strict';

const program = require('commander');
const mavenCentralClient = require('./mavenCentralClient');

program
    .version('1.0.0')
    .description('Maven central cli');

program
    .command('check <groupId> <arctifactId>')
    .description('Check arctifact version')
    .action((groupId, arctifactId) => mavenCentralClient.getDependencyVersion(groupId, arctifactId));

program.parse(process.argv);
