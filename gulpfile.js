var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browerSync   = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) //expanded
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('app/css'))
        .pipe(browerSync.reload({stream: true}))
});

gulp.task('scripts', function () {
    return gulp.src([
            'app/js/libs/jquery.min.js',
            'app/js/libs/*.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function () {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'))
});

gulp.task('clean', function () {
    return del.sync('dist');
});

// ЧИСТКА КЕША КАРТИНОК
gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('browser-sync', function () {
    browerSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('build', ['clean', 'img', 'css-libs', 'scripts'], function () {
   gulp.src('!app/css/libs.css', 'app/css/**/*.css')
       .pipe(gulp.dest('dist/css'));
   gulp.src('app/fonts/**/*')
       .pipe(gulp.dest('dist/fonts'));
   gulp.src('app/js/*.js')
       .pipe(gulp.dest('dist/js'));
   gulp.src('app/*.html')
       .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function () {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/*.html', browerSync.reload);
    gulp.watch('app/js/libs/*.js', ['scripts'], browerSync.reload);
    gulp.watch('app/js/*.js', browerSync.reload);
});

// default task
gulp.task('default', ['watch']);