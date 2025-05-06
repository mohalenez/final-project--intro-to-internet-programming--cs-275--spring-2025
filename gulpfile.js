// Clean Production Directory
function cleanProd() {
    // If you have del package installed
    // return del(['prod/**/*']);
    // Otherwise just log (add del with: npm install --save-dev del)
    console.log(`Production directory should be cleaned before build`);
    return Promise.resolve();
}
const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const browserSync = require(`browser-sync`).create();
const postcss = require(`gulp-postcss`);
const cssnano = require(`cssnano`);
const uglify = require(`gulp-uglify`);
const { src, dest, parallel, series } = require(`gulp`);
const htmlValidator = require(`gulp-html`);
const rename = require(`gulp-rename`);

// CSS Linting Function
function lintCSS() {
    return src(`app/css/*.css`).pipe(
        stylelint({
            configFile: `.stylelintrc.json`,
            reporters: [{ formatter: `string`, console: true }],
        })
    );
}

// JS Linting Function
function lintJS() {
    return src(`app/js/*.js`)
        .pipe(eslint({ useEslintrc: true }))
        .pipe(eslint.format());
}

// HTML Validation Function
function validateHTML() {
    return src(`app/html/*.html`).pipe(htmlValidator());
}

// CSS Validation Function
function validateCSS() {
    return lintCSS();
}

// JS Validation Function
function validateJS() {
    return lintJS();
}

// Transpile JS for Development
function transpileJSForDev() {
    return src(`app/js/app.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(dest(`dist/`));
}

// Transpile JS for Production
function transpileJSForProd() {
    return src(`app/js/app.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(rename({ suffix: `.min` }))
        .pipe(dest(`prod/js/`));
}

// Compress HTML
function compressHTML() {
    return src(`app/html/*.html`).pipe(dest(`prod/`)); // Output to prod root for easy access
}

// Copy HTML to root for development
function copyHTMLToRoot() {
    return src(`app/html/*.html`).pipe(dest(`app/`));
}

// Compress CSS
function compressCSS() {
    return src(`app/css/*.css`)
        .pipe(postcss([cssnano()]))
        .pipe(rename({ suffix: `.min` }))
        .pipe(dest(`prod/css/`)); // Output to prod/css directory
}

// Compress JS
function compressJS() {
    return src(`app/js/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(rename({ suffix: `.min` }))
        .pipe(dest(`prod/js/`)); // Output to prod/js directory
}

// Browser Sync Function
function browserSyncInit(done) {
    browserSync.init({
        server: {
            baseDir: `./app`,
            index: `html/index.html`, // Specify the index file path
        },
        open: true,
        port: 3000,
    });
    done();
}

// Browser Reload Function
function browserSyncReload(done) {
    browserSync.reload();
    done();
}

// Watch Files
function watchFiles() {
    gulp.watch(
        `app/html/*.html`,
        series(validateHTML, copyHTMLToRoot, browserSyncReload)
    );
    gulp.watch(`app/css/*.css`, series(validateCSS, browserSyncReload));
    gulp.watch(
        `app/js/*.js`,
        series(validateJS, transpileJSForDev, browserSyncReload)
    );
}

function buildJS() {
    return src(`app/js/app.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(dest(`prod/js`));
}

function buildCSS() {
    return src(`app/css/style.css`)
        .pipe(postcss([cssnano()]))
        .pipe(dest(`prod/css`));
}

function copyHTML() {
    return src(`app/html/index.html`).pipe(dest(`prod/html`));
}

// Development Task
const dev = series(
    parallel(validateHTML, validateCSS, validateJS),
    copyHTMLToRoot, // Copy HTML files to root for easier access
    transpileJSForDev,
    browserSyncInit,
    watchFiles
);

// Production Build Task
const build = series(
    cleanProd, // Clean production directory first
    parallel(validateHTML, validateCSS, validateJS), // Then validate all files
    parallel(compressHTML, compressCSS, compressJS), // Then compress files
    parallel(buildCSS, buildJS),
    copyHTML
);

// Export tasks
exports.lintCSS = lintCSS;
exports.lintJS = lintJS;
exports.validateHTML = validateHTML;
exports.validateCSS = validateCSS;
exports.validateJS = validateJS;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.compressHTML = compressHTML;
exports.compressCSS = compressCSS;
exports.compressJS = compressJS;
exports.copyHTMLToRoot = copyHTMLToRoot;
exports.cleanProd = cleanProd;
exports.default = dev;
exports.build = build;
