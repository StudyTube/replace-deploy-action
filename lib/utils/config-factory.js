"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = __importDefault(require("dateformat"));
const config_cdn_replaces_1 = require("./config-cdn-replaces");
function configFactory(revision, branch, cdnBaseDomain) {
    const date = new Date();
    const release = dateformat_1.default(date, 'yyyy-mm-') + revision;
    const distPath = 'dist';
    const jsFiles = `${distPath}/**/*.js`;
    let replacementTasks = [
        {
            files: jsFiles,
            from: /{REVISION}/g,
            to: revision,
        },
        {
            files: jsFiles,
            from: /{BRANCH}/g,
            to: branch
        },
        {
            files: jsFiles,
            from: /{RELEASE}/g,
            to: release
        },
        {
            files: jsFiles,
            from: /{BUILDTIME}/g,
            to: date
        }
    ];
    if (cdnBaseDomain) {
        console.log('Will do CDN related replacements');
        replacementTasks = [
            ...replacementTasks,
            ...config_cdn_replaces_1.getCdnReplaceConfig(revision, cdnBaseDomain)
        ];
    }
    return replacementTasks;
}
exports.configFactory = configFactory;
