import { MavenCentralClient } from './mavenCentralClient';
import { Reporter } from './reporter';
import { PomParser } from './parser/pomParser';

interface Dependency {
    groupid: string;
    artifactid: string;
    version: string;
}

interface Dependencies {
    dependency: Dependency[];
}

interface DependencyManagement {
    dependencies: Dependencies;
}

interface Project {
    parent: Dependency;
    properties: Record<string, string>;
    dependencymanagement: DependencyManagement;
    dependencies: Dependencies;
}

interface Pom {
    project: Project;
}

export interface PomWrapper {
    pomObject: Pom;
    pomXml: string;
}

export class PomReader {
    private mavenCentralClient: MavenCentralClient;
    private reporter: Reporter;
    private pomParser: PomParser;

    constructor(mavenCentralClient: MavenCentralClient, reporter: Reporter, pomParser: PomParser) {
        this.mavenCentralClient = mavenCentralClient;
        this.reporter = reporter;
        this.pomParser = pomParser;
    }

    private static buildExternalVersionsMap(pomObject: Pom): Map<string, string> {
        const versionsMap = new Map<string, string>();
        for (const [key, value] of Object.entries(pomObject.project.properties)) {
            versionsMap.set(`$\{${key}}`, value);
        }
        return versionsMap;
    }

    private async buildReport(pomObject: Pom): Promise<void> {
        const outdatedDependencies = [];

        const versionByArtifactId = PomReader.buildExternalVersionsMap(pomObject); // holds versions from properties block

        let allPomDependencies: Dependency[];
        if (pomObject.project.dependencies) {
            allPomDependencies = pomObject.project.dependencies.dependency;
        } else {
            // multi-module with dependencyManagement
            allPomDependencies = pomObject.project.dependencymanagement.dependencies.dependency;
        }

        if (pomObject.project.parent) {
            allPomDependencies.push(pomObject.project.parent);
        }

        const promises = allPomDependencies.map(dependency => this.mavenCentralClient.getDependencyVersion(dependency.groupid, dependency.artifactid));
        const latestVersions = await Promise.all(promises);

        for (const [index, dependency] of allPomDependencies.entries()) {
            let currentVersion: string | undefined = dependency.version;
            if (currentVersion && currentVersion.includes('${')) {
                currentVersion = versionByArtifactId.get(dependency.version);
            }

            if (currentVersion && (latestVersions[index] > currentVersion)) {
                outdatedDependencies.push([`${dependency.groupid} ${dependency.artifactid}`, currentVersion, latestVersions[index]]);
            }
        }

        this.reporter.displayReport(outdatedDependencies);
    }

    public async readAndProduceReport(pomPath: string): Promise<void> {
        const pomResponse = await this.pomParser.parse(pomPath);
        if (pomResponse) {
            await this.buildReport(pomResponse.pomObject);
        }
    }
}
