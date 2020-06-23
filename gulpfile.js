const gulp = require("gulp");
const srcset = require("gulp-srcset").default;
const using = require('gulp-using');
const flatten = require('gulp-flatten');

const imageDest = './submissions_dest/'
const sizes = [700, 1500]

gulp.task('images', () =>
    gulp.src('./submissions/responses/*.{jpg,jpeg,JPG,JPEG,png,PNG}')
        .pipe(srcset([
            {
                format: ['webp', 'jpg'],
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