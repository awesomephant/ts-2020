const gulp = require("gulp");
const srcset = require("gulp-srcset").default;
const using = require('gulp-using');
const flatten = require('gulp-flatten');

const imageDest = './submission-images/'
const sizes = [100, 1500]

gulp.task('images', () =>
    gulp.src('./submissions/**/*.{jpg,jpeg,JPG,JPEG,png,PNG}')
        .pipe(srcset([
            {
                format: ['webp'],
                width: sizes,
            }
        ]))
        .pipe(using({
            prefix:
                'Writing', color: 'yellow'
        }))
        .pipe(flatten())
        .pipe(gulp.dest(imageDest))
);