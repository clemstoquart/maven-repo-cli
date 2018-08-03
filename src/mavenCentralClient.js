'use strict';

const axios = require('axios');
const xml = require('xml2json');

async function getDependencyVersion(groupId, arctifactId) {
    try {
        const url = `https://repo.maven.apache.org/maven2/${groupId.replace(/\./g, '/')}/${arctifactId}/maven-metadata.xml`;

        const mavenXmlMetadata = await axios.get(url);

        const jsonMetadata = JSON.parse(xml.toJson(mavenXmlMetadata.data));

        return jsonMetadata.metadata.versioning.latest;
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
