'use strict';

const Table = require('cli-table3');

function displayReport(outdatedDependencies) {
    const table = new Table({head: ['Name', 'Current version', 'Latest version']});
    outdatedDependencies.forEach(dependency => table.push(dependency));
    console.log(table.toString());
}

module.exports = { displayReport };
