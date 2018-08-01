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
        if (error.response.status !== 404) {
            console.error(`Error while retrieving version for ${groupId} ${arctifactId} : ${error}`);
        }
    }
}

module.exports = { getDependencyVersion };
