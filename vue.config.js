const packageJson = require('./package.json')

const defaultRepoName = packageJson.name
const repoName = process.env.GH_PAGES_REPO || defaultRepoName
const customGhPagesPublicPath = process.env.GH_PAGES_PUBLIC_PATH

const resolveProductionPublicPath = () => {
  if (typeof customGhPagesPublicPath === 'string' && customGhPagesPublicPath.length > 0) {
    return customGhPagesPublicPath
  }

  return `/${repoName}/`
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? resolveProductionPublicPath() : '/'
}
