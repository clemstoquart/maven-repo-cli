'use strict';

const axios = require('axios');
const xmlJs = require('xml-js');

async function getDependencyVersion(groupId, arctifactId) {
    try {
        const url = `https://repo.maven.apache.org/maven2/${groupId.replace(/\./g, '/')}/${arctifactId}/maven-metadata.xml`;

        const mavenXmlMetadata = await axios.get(url);

        const mavenMetadata = xmlJs.xml2js(mavenXmlMetadata.data, { compact: true });

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

module.exports = { getDependencyVersion };
