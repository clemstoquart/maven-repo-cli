/**
 * Improved version of https://github.com/intuit/node-pom-parser
 */
import { promises as fs } from 'fs';
import xml2js, { OptionsV2 } from 'xml2js';
import traverse from 'traverse';
import { PomWrapper } from '../pomReader';

// xmljs options https://github.com/Leonidas-from-XIV/node-xml2js#options
const XML2JS_OPTS: OptionsV2 = {
    trim: true,
    normalizeTags: true,
    normalize: true,
    mergeAttrs: true
};

export class PomParser {

    /**
     * Parses xml into javascript object by using a file path.
     * @param {string} filePath the filePath of the pom
     * @return {object} The pom object along with the timers.
     */
    public async parse(filePath: string): Promise<PomWrapper> {
        try {
            const xmlContent = await fs.readFile(filePath, 'utf8');

            return await this.parseWithXml2js(xmlContent);
        } catch (error) {
            console.error(error);
            return process.exit(1);
        }
    }

    /**
     * Parses the given xml content.
     * @param xmlContent {string} Is the xml content in string using utf-8 format.
     */
    private parseWithXml2js(xmlContent: string): Promise<PomWrapper> {
        return new Promise((resolve, reject): void => {
            // parse the pom, erasing all
            xml2js.parseString(xmlContent, XML2JS_OPTS, (err, pomObject) => {
                if (err) {
                    // Reject with the error
                    reject(err);
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                this.removeSingleArrays(pomObject);

                // Response to the call
                resolve({
                    pomXml: xmlContent, // Only add the pomXml when loaded from the file-system.
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    pomObject: pomObject // Always add the object
                });
            });
        });
    }

    /**
     * Removes all the arrays with single elements with a string value.
     * @param {object} obj is the object to be traversed.
     */
    private removeSingleArrays(obj: Record<string, unknown>): void {
        // Traverse all the elements of the object
        traverse(obj).forEach(function traversing(value) {
            // As the XML parser returns single fields as arrays.
            if (value instanceof Array && value.length === 1) {
                this.update(value[0]);
            }
        });
    }
}
