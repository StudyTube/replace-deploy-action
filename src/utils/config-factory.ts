import dateFormat from 'dateformat';

import { getCdnReplaceConfig } from './config-cdn-replaces';

export function configFactory(revision, branch, cdnBaseDomain) {
  const date = new Date();
  const release = dateFormat(date, 'yyyy-mm-') + revision;
  const distPath = 'dist'
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
      ...getCdnReplaceConfig(revision, cdnBaseDomain)
    ];
  }

  return replacementTasks;
}
