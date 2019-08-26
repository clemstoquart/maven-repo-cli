import Table, { HorizontalTable } from 'cli-table3';

export class Reporter {

    public displayReport(outdatedDependencies: Array<Array<string>>): void {
        const table = new Table({head: ['Name', 'Current version', 'Latest version']}) as HorizontalTable;
        outdatedDependencies.forEach(dependency => {
            return table.push(dependency);
        });
        console.log(table.toString());
    }
}
