import program from 'commander';
import { MavenCentralClient } from './mavenCentralClient';
import { PomReader } from './pomReader';
import { Reporter } from './reporter';
import { PomParser } from './parser/pomParser';

program
    .version('1.0.0')
    .description('Maven central cli');

program
    .command('check <groupId> <arctifactId>')
    .description('Check arctifact version')
    .action((groupId: string, arctifactId: string) => new MavenCentralClient().getDependencyVersion(groupId, arctifactId)
        .then((version) => console.log(version)));

program
    .command('checkPom <pomPath>')
    .description('Check all artifacts and report outdated ones')
    .action(pomPath => new PomReader(new MavenCentralClient(), new Reporter(), new PomParser()).readAndProduceReport(pomPath));

program.parse(process.argv);
