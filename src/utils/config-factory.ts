import dateFormat from 'dateformat';

export function configFactory(revision, branch) {
  const date = new Date();
  const release = dateFormat(date, 'yyyy-mm-') + revision;
  const distPath = 'dist'
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
