import axios, { AxiosError } from 'axios';
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

    public async getDependencyVersion(groupId: string, artifactId: string): Promise<string> {
        try {
            const url = `https://repo.maven.apache.org/maven2/${groupId.replace(/\./g, '/')}/${artifactId}/maven-metadata.xml`;

            const { data } = await axios.get<string>(url);

            const mavenMetadata = xmlJs.xml2js(data, { compact: true }) as MavenMetadata;

            return MavenCentralClient.findLatestVersion(mavenMetadata.metadata);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                MavenCentralClient.handleAxiosError(error, groupId, artifactId);
            } else {
                console.error('Unexpected error');
                console.error(error);
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

    private static handleAxiosError(error: AxiosError, groupId: string, artifactId: string) {
        if (error.code === 'ENOTFOUND') {
            console.error(`Can't reach maven repository for ${groupId} ${artifactId}`);
            console.error(error);
        }

        if (error.response?.status !== 404) {
            console.error(`Artifact ${groupId} ${artifactId} not found`);
        }

        if (error.message) {
            console.error(`Error finding version for ${groupId} ${artifactId} : ${error.message}`);
        }
    }
}
