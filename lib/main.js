"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const replace_in_file_1 = __importDefault(require("replace-in-file"));
const config_factory_1 = require("./config-factory");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const revision = github.context.sha.slice(0, 6);
            const branch = github.context.ref.replace('refs/heads/', '');
            const cdnBaseUrl = core.getInput('cdn-base-url');
            const tasks = config_factory_1.configFactory(revision, branch, cdnBaseUrl);
            console.log(`Working on revision: ${revision}`);
            console.log(`Branch: ${branch}`);
            console.log('CDN base url:', cdnBaseUrl);
            console.log('Tasks: \n' + JSON.stringify(tasks));
            const promises = tasks.map(task => replace_in_file_1.default(task)
                .then(findings => findings
                .filter(finding => finding.hasChanged)
                .map(finding => finding.file))
                .then(console.log));
            yield Promise.all(promises);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
