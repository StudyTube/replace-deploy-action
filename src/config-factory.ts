import dateFormat from 'dateformat';

export function configFactory(revision, branch, cdnBaseUrl) {
  const date = new Date();
  const release = dateFormat(date, 'yyyy-mm-') + revision;
  const baseFileMask = 'dist/**/*.';
  const assetsUrl = `${cdnBaseUrl}/${revision}/assets`;
  const scriptsUrl = `${cdnBaseUrl}/${revision}/scripts`;

  const [jsFiles, scssFiles, htmlFiles] =
    ['js', 'scss', 'html'].map(extension => baseFileMask + extension);

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
  ];

  return replacementTasks;
}
