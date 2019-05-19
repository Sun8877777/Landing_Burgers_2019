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
	return gulp.src('app/scss/style.scss') 
		.pipe(sass())
		.pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
		.pipe(gulp.dest('app/css')) 
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() { 
	browserSync({ 
		server: { 
			baseDir: 'app' 
		},
		notify: false
	});
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('css-libs', function() {
	return gulp.src('app/css/style.css') 
		.pipe(sass().on('error', sass.logError)) 
		.pipe(cssnano()) 
		.pipe(rename({suffix: '.min'})) 
		.pipe(gulp.dest('app/css')); 
});

gulp.task('scripts', function() {
	return gulp.src(['app/js/*.js'])
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('svg', function() {
	return gulp.src('app/img/svg/*.svg')
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
			// mode: {
			// 	symbol: {
			// 		sprite: '../sprite.svg'
			// 	}
			// }
			mode: {
				stack: {
						sprite: "../sprite.svg"  //sprite file name
				}
		  },
		})) 
		.pipe(gulp.dest('app/img'))
});

//автодобавление scss пока  в тесте
 
gulp.task('css', function() {
    return gulp
            .src('!app/scss/style.scss','app/scss/**/*.scss')
            .pipe(bulkSass())
            .pipe(
                sass({
                    includePaths: ['!app/scss/style.scss','app/scss/**/*.scss']
                }))
            .pipe( gulp.dest('app') );
});


gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('sass')); 
	gulp.watch('app/*.html', gulp.parallel('code')); 
	gulp.watch(['app/js/*.js'], gulp.parallel('scripts')); 
});
gulp.task('default', gulp.parallel('svg','css-libs', 'sass', 'scripts', 'browser-sync', 'watch'));
