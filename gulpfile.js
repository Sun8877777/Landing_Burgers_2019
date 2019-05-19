var gulp       = require('gulp'),
	sass         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	cssnano      = require('gulp-cssnano'),
	rename       = require('gulp-rename'), 
	autoprefixer = require('gulp-autoprefixer'),
	svgmin       = require('gulp-svgmin'),
	replace      = require('gulp-replace'),
	cheerio      = require('gulp-cheerio'),
	svgSprite    = require('gulp-svg-sprite'),
	bulkSass     = require('gulp-sass-bulk-import');

gulp.task('sass', function() { 
	return gulp.src('docs/scss/style.scss') 
		.pipe(sass())
		.pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
		.pipe(gulp.dest('docs/css')) 
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() { 
	browserSync({ 
		server: { 
			baseDir: 'docs' 
		},
		notify: false
	});
});

gulp.task('code', function() {
	return gulp.src('docs/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('css-libs', function() {
	return gulp.src('docs/css/style.css') 
		.pipe(sass().on('error', sass.logError)) 
		.pipe(cssnano()) 
		.pipe(rename({suffix: '.min'})) 
		.pipe(gulp.dest('docs/css')); 
});

gulp.task('scripts', function() {
	return gulp.src(['docs/js/*.js'])
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('svg', function() {
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

//автодобавление scss пока  в тесте
 
gulp.task('css', function() {
    return gulp
            .src('!docs/scss/style.scss','docs/scss/**/*.scss')
            .pipe(bulkSass())
            .pipe(
                sass({
                    includePaths: ['!docs/scss/style.scss','docs/scss/**/*.scss']
                }))
            .pipe( gulp.dest('docs') );
});


gulp.task('watch', function() {
	gulp.watch('docs/scss/**/*.scss', gulp.parallel('sass')); 
	gulp.watch('docs/*.html', gulp.parallel('code')); 
	gulp.watch(['docs/js/*.js'], gulp.parallel('scripts')); 
});
gulp.task('default', gulp.parallel('svg','css-libs', 'sass', 'scripts', 'browser-sync', 'watch'));
