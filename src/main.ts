import * as core from '@actions/core';
import * as github from '@actions/github';
import replace from 'replace-in-file';

import { configFactory } from './config-factory';

async function run() {
  try {
    const revision = github.context.sha.slice(0, 6);
    const branch = github.context.ref.replace('refs/heads/', '');
    const tasks = configFactory(revision, branch);

    console.log(`Working on revision: ${revision}`);
    console.log(`Branch: ${branch}`);
    console.log('Tasks: \n' + JSON.stringify(tasks));

    const promises = tasks.map(
      task => replace(task)
        .then(findings => findings
          .filter(finding => finding.hasChanged)
          .map(finding => finding.file)
        )
        .then(console.log)
    );

    await Promise.all(promises);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
