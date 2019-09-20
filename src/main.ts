import * as core from '@actions/core';
import * as github from '@actions/github';
import replace from 'replace-in-file';

import { configFactory } from './config-factory';

async function run() {
  try {
    const revision = core.getInput('revision');
    const branch = github.context.ref.replace('refs/heads/', '');
    const cdnBaseUrl = core.getInput('cdn-base-url');
    const tasks = configFactory(revision, branch, cdnBaseUrl);

    console.log(`Working on revision: ${revision}`);
    console.log(`Branch: ${branch}`);
    console.log('CDN base url:', cdnBaseUrl);

    const replaceResults = tasks
      .map(
        task => replace
          .sync(task)
          .filter(finding => finding.hasChanged)
          .map(finding => finding.file)
    );

    console.log('File replacements:');
    console.dir(replaceResults);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
