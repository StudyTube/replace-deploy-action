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
const child_process_1 = require("child_process");
const config_factory_1 = require("./utils/config-factory");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const revision = child_process_1.execSync('git rev-parse --short=6 HEAD').toString().trim();
            const branch = github.context.ref.replace('refs/heads/', '');
            const cdnBaseDomain = core.getInput('cdn-base-domain');
            const tasks = config_factory_1.configFactory(revision, branch, cdnBaseDomain);
            console.log(`Working on revision: ${revision}`);
            console.log(`Branch: ${branch}`);
            console.log('CDN base domain:', cdnBaseDomain);
            const replaceResults = tasks
                .map(task => replace_in_file_1.default
                .sync(task)
                .filter(finding => finding.hasChanged)
                .map(finding => finding.file));
            console.log('File replacements:');
            console.dir(replaceResults);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
