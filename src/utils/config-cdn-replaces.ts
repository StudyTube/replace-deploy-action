import { readdirSync, lstatSync } from 'fs';

export function getCdnReplaceConfig(revision, cdnBaseDomain) {
  const distPath = 'dist'
  const baseFileMask = `${distPath}/**/*.`;
  const deployDomainPath = `${cdnBaseDomain}/${revision}`
  const assetsUrl = `https://${deployDomainPath}/assets`;
  const scriptsUrl = `https://${deployDomainPath}/scripts`;

  const [jsFiles, cssFiles, scssFiles, htmlFiles] =
    ['js', 'css', 'scss', 'html'].map(extension => baseFileMask + extension);

  return [
    {
      files: htmlFiles,
      from: /"\/scripts/g,
      to: '"' + scriptsUrl
    },
    {
      files: [jsFiles, htmlFiles, cssFiles, scssFiles],
      from: /{DEPLOY_DOMAIN_PATH_TO_REPLACE}/g,
      to: deployDomainPath
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
    ...getFontUrlsReplaceConfig(distPath, cssFiles, deployDomainPath)
  ];
}

function getFontUrlsReplaceConfig(distPath, filesToReplace, deployDomainPath) {
  const urlEndsToIgnore = ['.js', '.html', '.css', '.scss', 'favicon.ico'];

  return readdirSync(distPath)
    .filter(filename => lstatSync([distPath, filename].join('/')).isFile())
    .filter(filename => !urlEndsToIgnore.some(endToIgnore => filename.endsWith(endToIgnore)))
    .map(filename => ({
      files: filesToReplace,
      from: new RegExp(`url\\(${filename}`, 'g'),
      to: `url(https://${deployDomainPath}/${filename}`
    }));
}
