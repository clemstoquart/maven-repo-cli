'use strict';

const axios = require('axios');

async function getDependencyVersion(groupId, arctifactId) {
    try {
        const response = await axios.get(`https://search.maven.org/solrsearch/select?q=g:%22${groupId}%22%20AND%20a:%22${arctifactId}%22%20&wt=json`);
        console.log(response.data.response.docs[0].latestVersion);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getDependencyVersion };
