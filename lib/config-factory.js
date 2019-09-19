"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = __importDefault(require("dateformat"));
const fs_1 = require("fs");
function configFactory(revision, branch, cdnBaseUrl) {
    const date = new Date();
    const release = dateformat_1.default(date, 'yyyy-mm-') + revision;
    const distPath = 'dist';
    const baseFileMask = `${distPath}/**/*.`;
    const assetsUrl = `${cdnBaseUrl}/${revision}/assets`;
    const scriptsUrl = `${cdnBaseUrl}/${revision}/scripts`;
    const [jsFiles, cssFiles, scssFiles, htmlFiles] = ['js', 'css', 'scss', 'html'].map(extension => baseFileMask + extension);
    const replacementTasks = [
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
        },
        {
            files: htmlFiles,
            from: /"\/scripts/g,
            to: '"' + scriptsUrl
        },
        {
            files: jsFiles,
            from: '{SCRIPTS_PATH_TO_REPLACE}',
            to: scriptsUrl
        },
        {
            files: jsFiles,
            from: '{ASSETS_PATH_TO_REPLACE}',
            to: assetsUrl
        },
        {
            files: htmlFiles,
            from: /"\/assets/g,
            to: '"' + assetsUrl
        },
        {
            files: scssFiles,
            from: /\(\/assets/g,
            to: '(' + assetsUrl
        },
        ...getFontUrlsReplaceConfig(distPath, cssFiles, cdnBaseUrl)
    ];
    return replacementTasks;
}
exports.configFactory = configFactory;
function getFontUrlsReplaceConfig(distPath, filesToReplace, cdnBaseUrl) {
    const urlEndsToIgnore = ['.js', '.html', '.css', '.scss', 'favicon.ico'];
    return fs_1.readdirSync(distPath)
        .filter(filename => fs_1.lstatSync([distPath, filename].join('/')).isFile())
        .filter(filename => !urlEndsToIgnore.some(endToIgnore => filename.endsWith(endToIgnore)))
        .map(filename => ({
        files: filesToReplace,
        from: `url(${filename}`,
        to: `url(${cdnBaseUrl}/${filename}`
    }));
}
