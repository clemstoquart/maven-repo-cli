import Table from 'cli-table3';

export class Reporter {

    public displayReport(outdatedDependencies: string[][]): void {
        const table = new Table({head: ['Name', 'Current version', 'Latest version']});
        outdatedDependencies.forEach(dependency => {
            return table.push(dependency);
        });
        console.log(table.toString());
    }
}
