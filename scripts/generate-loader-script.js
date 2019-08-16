const fs = require('fs')
const path = require('path')
const glob = require('glob')

const buildDir = path.resolve(__dirname, '../build/')
const staticDir = path.join(buildDir, '/static')
const buildJsFilesPath = path.join(staticDir, '/js/**/*.js')
const loaderJsPath = path.join(buildDir, 'm.js')

const baseFilePath = 'epic-perlman-1a7654.netlify.com/'

function generateJsScript(jsFileName) {
  if (!jsFileName) {
    return ''
  }

  return `
  const search = new URL(window.location).searchParams;
  const id = search.get('sideload');
  const prefix = id ? id + '--' : '';
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
  script.src = 'https://' + prefix + '${baseFilePath}/static/js/${jsFileName}';
	document.getElementsByTagName('body')[0].appendChild(script);
	`
}

function generateLoaderScript() {
  const [jsFile] = glob.sync(buildJsFilesPath)
  if (!jsFile) {
    // eslint-disable-next-line no-console
    console.log('Could not find .js file. Try running npm run build.')
    return
  }
  const jsFileName = path.basename(jsFile)

  const content = `
	(function(document) {
		${generateJsScript(jsFileName)};
	})(window.document);
	`
    .replace(/\n|\t/g, '')
    .trim()

  fs.writeFileSync(loaderJsPath, content)
  // eslint-disable-next-line no-console
  console.log('Generated loader.js file')
}

;(() => generateLoaderScript())()
