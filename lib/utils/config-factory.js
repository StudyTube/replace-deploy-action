"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = __importDefault(require("dateformat"));
function configFactory(revision, branch) {
    const date = new Date();
    const release = dateformat_1.default(date, 'yyyy-mm-') + revision;
    const distPath = 'dist';
    const jsFiles = `${distPath}/**/*.js`;
    return [
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
}
exports.configFactory = configFactory;
