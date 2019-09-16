import * as core from '@actions/core';
import * as github from '@actions/github';
import * as dateFormat from 'dateformat';

async function run() {
  try {
    console.log('REV, BRANCH, DATE');

    console.log(github.context.sha.slice(0, 6));
    console.log(github.context.ref.replace('refs/heads/', ''));
    console.log(dateFormat(new Date(), 'yyyy-mm-'));
    console.log(new Date());

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();