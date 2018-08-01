'use strict';

const pomParser = require('pom-parser');
const mavenCentralClient = require('./mavenCentralClient');
const reporter = require('./reporter');

function _buildExternalVersionsMap(pomObject) {
    const versionsMap = new Map();
    for (const [key, value] of Object.entries(pomObject.project.properties)) {
        // eslint-disable-next-line no-useless-escape
        versionsMap.set(`\$\{${key}\}`, value);
    }
    return versionsMap;
}

async function _buildReport(pomObject) {
    const outdatedDependencies = [];

    const versionByArtifactId = _buildExternalVersionsMap(pomObject); // holds versions from properties block

    const allPomDependencies = pomObject.project.dependencies.dependency;
    if (pomObject.project.parent) {
        allPomDependencies.push(pomObject.project.parent);
    }

    for (const dependency of allPomDependencies) {
        const latestVersion = await mavenCentralClient.getDependencyVersion(dependency.groupid, dependency.artifactid);

        let currentVersion = dependency.version;
        if (currentVersion && currentVersion.includes('${')) {
            currentVersion = versionByArtifactId.get(dependency.version);
        }

        if (currentVersion && (latestVersion > currentVersion)) {
            outdatedDependencies.push([`${dependency.groupid} ${dependency.artifactid}`, currentVersion, latestVersion]);
        }
    }

    reporter.displayReport(outdatedDependencies);
}

function readAndProduceReport(pomPath) {
    const opts = {
        filePath: pomPath,
    };
    pomParser.parse(opts, function(err, pomResponse) {
        if (err) {
            console.log(`ERROR: ${err}`);
            process.exit(1);
        }

        return _buildReport(pomResponse.pomObject);
    });
}

module.exports = { readAndProduceReport };
