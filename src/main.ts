import * as core from '@actions/core';
import * as github from '@actions/github';
import replace from 'replace-in-file';
import { execSync } from 'child_process';

import { configFactory } from './config-factory';

async function run() {
  try {
    const revision = execSync('git rev-parse --short=6 HEAD').toString().trim();
    const branch = github.context.ref.replace('refs/heads/', '');
    const cdnBaseDomain = core.getInput('cdn-base-domain');
    const tasks = configFactory(revision, branch, cdnBaseDomain);

    console.log(`Working on revision: ${revision}`);
    console.log(`Branch: ${branch}`);
    console.log('CDN base domain:', cdnBaseDomain);

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
