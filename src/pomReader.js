'use strict';

const pomParser = require('./parser/pomParser');
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

    let allPomDependencies;
    if (pomObject.project.dependencies) {
        allPomDependencies = pomObject.project.dependencies.dependency;
    } else {
        // multi-module with dependencyManagement
        allPomDependencies = pomObject.project.dependencymanagement.dependencies.dependency;
    }

    if (pomObject.project.parent) {
        allPomDependencies.push(pomObject.project.parent);
    }

    const promises = allPomDependencies.map(dependency => mavenCentralClient.getDependencyVersion(dependency.groupid, dependency.artifactid));
    const latestVersions = await Promise.all(promises);

    for (const [index, dependency] of allPomDependencies.entries()) {
        let currentVersion = dependency.version;
        if (currentVersion && currentVersion.includes('${')) {
            currentVersion = versionByArtifactId.get(dependency.version);
        }

        if (currentVersion && (latestVersions[index] > currentVersion)) {
            outdatedDependencies.push([`${dependency.groupid} ${dependency.artifactid}`, currentVersion, latestVersions[index]]);
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
