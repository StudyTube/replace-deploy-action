import dateFormat from 'dateformat';
import { readdirSync, lstatSync } from 'fs';

export function configFactory(revision, branch, cdnBaseUrl) {
  const date = new Date();
  const release = dateFormat(date, 'yyyy-mm-') + revision;
  const distPath = 'dist'
  const baseFileMask = `${distPath}/**/*.`;
  const assetsUrl = `${cdnBaseUrl}/${revision}/assets`;
  const scriptsUrl = `${cdnBaseUrl}/${revision}/scripts`;

  const [jsFiles, cssFiles, scssFiles, htmlFiles] =
    ['js', 'css', 'scss', 'html'].map(extension => baseFileMask + extension);

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
      from: /{SCRIPTS_PATH_TO_REPLACE}/g,
      to: scriptsUrl
    },
    {
      files: jsFiles,
      from: /{ASSETS_PATH_TO_REPLACE}/g,
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
    ...getFontUrlsReplaceConfig(distPath, cssFiles, cdnBaseUrl)
  ];

  return replacementTasks;
}

function getFontUrlsReplaceConfig(distPath, filesToReplace, cdnBaseUrl) {
  const urlEndsToIgnore = ['.js', '.html', '.css', '.scss', 'favicon.ico'];

  return readdirSync(distPath)
    .filter(filename => lstatSync([distPath, filename].join('/')).isFile())
    .filter(filename => !urlEndsToIgnore.some(endToIgnore => filename.endsWith(endToIgnore)))
    .map(filename => ({
      files: filesToReplace,
      from: new RegExp(`url\(${filename}`, 'g'),
      to: `url(${cdnBaseUrl}/${filename}`
    }));
}
