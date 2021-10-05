const TendrilClient = require("./tendrilClient");
const TendrilHost = require("./tendrilHost");

module.exports = function tendril(hostDomain, username, operations) {
    if(hostDomain) {
        return new TendrilClient(hostDomain, username, operations);
    } else {
        return new TendrilHost();
    }
};
