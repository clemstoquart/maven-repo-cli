import axios from 'axios';
import xmlJs from 'xml-js';

interface Latest {
    _text: string;
}

interface Versioning {
    latest: Latest;
}

interface Metadata {
    versioning: Versioning;
    version: Latest;
}

interface MavenMetadata {
    metadata: Metadata;
}

export class MavenCentralClient {

    public async getDependencyVersion(groupId: string, arctifactId: string): Promise<string> {
        try {
            const url = `https://repo.maven.apache.org/maven2/${groupId.replace(/\./g, '/')}/${arctifactId}/maven-metadata.xml`;

            const mavenXmlMetadata = await axios.get(url);

            const mavenMetadata = xmlJs.xml2js(mavenXmlMetadata.data, { compact: true }) as MavenMetadata;

            return MavenCentralClient.findLatestVersion(mavenMetadata.metadata);
        } catch (error) {
            if (error.code === 'ENOTFOUND') {
                console.error(`Can't reach maven repository for ${groupId} ${arctifactId} : ${error}`);
            }

            if (error.response && error.response.status !== 404) {
                console.error(`Artifact ${groupId} ${arctifactId} not found`);
            }

            if (error.message) {
                console.error(`Error finding version for ${groupId} ${arctifactId} : ${error.message}`);
            }

            return '';
        }
    }

    private static findLatestVersion(metadata: Metadata): string {
        if (metadata.versioning.latest != undefined) {
            return metadata.versioning.latest._text;
        } else {
            return metadata.version._text;
        }
    }
}
