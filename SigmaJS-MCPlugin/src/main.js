const clip = require("./SigmaBasePlugin.js");
const SigmaAnimPlugin = require("./SigmaAnimPlugin.js");
const MyAttrChannel = require("./MyAttrChannel.js");
const MC = require("@kissmybutton/motorcortex");

module.exports = {
    npm_name: "kissmybutton/motorcortex-bill-sigma",
    incidents: [
        {
            exportable: SigmaAnimPlugin,
            name: "SigmaAnimPlugin"
        }
    ],
    channel: MyAttrChannel,
    clip
};