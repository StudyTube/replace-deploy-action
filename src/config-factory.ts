import dateFormat from 'dateformat';

export function configFactory(revision, branch) {
  const date = new Date();
  const release = dateFormat(date, 'yyyy-mm-') + revision;
  const baseFileMask = 'dist/**/*.';

  const [jsFiles, cssFiles, htmlFiles] =
    ['js', 'css', 'html'].map(extension => baseFileMask + extension);

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
      from: /"\/scripts\//g,
      to: `"/${revision}/scripts/`
    },
    {
      files: [jsFiles, cssFiles, htmlFiles],
      from: /"\/assets\//g,
      to: `"/${revision}/assets/`
    },
    {
      files: [jsFiles, cssFiles, htmlFiles],
      from: /\(\/assets\//g,
      to: `(/${revision}/assets/`
    },
  ];

  return replacementTasks;
}
