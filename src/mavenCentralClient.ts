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
}

interface MavenMetadata {
    metadata: Metadata;
}

export class MavenCentralClient {

    public async getDependencyVersion(groupId: string, arctifactId: string): Promise<string | undefined> {
        try {
            const url = `https://repo.maven.apache.org/maven2/${groupId.replace(/\./g, '/')}/${arctifactId}/maven-metadata.xml`;

            const mavenXmlMetadata = await axios.get(url);

            const mavenMetadata = xmlJs.xml2js(mavenXmlMetadata.data, { compact: true }) as MavenMetadata;

            return mavenMetadata.metadata.versioning.latest._text;
        } catch (error) {
            if (error.code === 'ENOTFOUND') {
                console.error(`Can't reach maven repository for ${groupId} ${arctifactId} : ${error}`);
            }

            if (error.response && error.response.status !== 404) {
                console.error(`Artifact ${groupId} ${arctifactId} not found`);
            }
        }
    }
}
