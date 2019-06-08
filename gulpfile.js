var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	svgmin = require('gulp-svgmin'),
	replace = require('gulp-replace'),
	cheerio = require('gulp-cheerio'),
	svgSprite = require('gulp-svg-sprite'),
	bulkSass = require('gulp-sass-bulk-import'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache');

gulp.task('sass', function () {
	return gulp.src('docs/scss/style.scss')
		.pipe(sass())
		.pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('docs/css'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'docs'
		},
		notify: false
	});
});
gulp.task('scripts', function () {
	return gulp.src([
		'docs/libs/jquery/dist/jquery.min.js',
		'docs/libs/mobile-detect/mobile-detect.min.js',
		'docs/libs/jquery-touchswipe/jquery.touchSwipe.min.js'
	])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('docs/js'))
})

gulp.task('code', function () {
	return gulp.src('docs/*.html')
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('css-libs', function () {
	return gulp.src('docs/css/style.css')
		.pipe(sass().on('error', sass.logError))
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('docs/css'));
});

gulp.task('changejs', function () {
	return gulp.src(['docs/js/*.js'])
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('svg', function () {
	return gulp.src('docs/img/svg/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				// $('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"  //sprite file name
				}
			},
		}))
		.pipe(gulp.dest('docs/img'))
});

gulp.task('clean', async function () {
	return del.sync('prod'); // Удаляем папку prod перед сборкой
});

gulp.task('img', function () {
	return gulp.src('docs/img/**/*')
		.pipe(cache(imagemin({ // С кешированием
			// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('prod/img'));
});
// продакшн
gulp.task('prebuild', async function () {

	var buildCss = gulp.src([
		'docs/css/style.min.css',
	])
		.pipe(gulp.dest('prod/css'))

	var buildFonts = gulp.src('docs/font/**/*')
		.pipe(gulp.dest('prod/font'))

	var buildJs = gulp.src('docs/js/**/*')
		.pipe(gulp.dest('prod/js'))

	var buildHtml = gulp.src('docs/*.html')
		.pipe(gulp.dest('prod'));

});



//автодобавление scss пока  в тесте

// gulp.task('css', function() {
//     return gulp
//             .src('!docs/scss/style.scss','docs/scss/**/*.scss')
//             .pipe(bulkSass())
//             .pipe(
//                 sass({
//                     includePaths: ['!docs/scss/style.scss','docs/scss/**/*.scss']
//                 }))
//             .pipe( gulp.dest('docs') );
// });


gulp.task('watch', function () {
	gulp.watch('docs/scss/**/*.scss', gulp.parallel('sass'));
	gulp.watch('docs/*.html', gulp.parallel('code'));
	gulp.watch(['docs/js/*.js'], gulp.parallel('changejs'));
});
gulp.task('default', gulp.parallel('svg', 'css-libs', 'sass', 'changejs', 'scripts', 'browser-sync', 'watch'));

gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'sass', 'changejs'));