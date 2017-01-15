var gulp = require("gulp");
var less = require("gulp-less");
var path = require("path");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
var haml = require('gulp-haml');
var sourcemaps = require("gulp-sourcemaps");
var mincss = require("gulp-minify-css");
var concat = require('gulp-concat');
var watch = require("gulp-watch");
var pug = require('gulp-pug');

gulp.task('default', ['images-to-dist', 'fonts-prepare', "bootstrap-prepare", 'less-prebuild', 'js-prepare'], function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  //watch to changing of html files
  watch("./src/html/*.html", function() {
    console.log("html changed");
    gulp.src("./src/html/*.html")
      .pipe(gulp.dest('./dist'));
    reload();
  });
  watch("./src/img/*", function() {
    console.log("image changed");
    return gulp.src("./src/img/*")
      .pipe(gulp.dest("./dist/img"));
  });

  //reload if dist file is changed
  gulp.watch("./dist/css/main.css").on("change", reload);
  gulp.watch('./dist/*.html').on("change", function() {
    console.log('html changed');
    reload();
  });

  //watch for less files
  watch("./src/less/*.less", function() {
    console.log("less changed")
    return gulp.src("./src/less/main.less")
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(sourcemaps.write())
      .pipe(mincss())
      // .pipe(concat("style.css"))
      .pipe(gulp.dest("./dist/css/"))
      // .pipe(reload());
  });

  watch('./src/pug/**/*.pug', function() {
    console.log('pug changed');
    return gulp.src('./src/pug/**/*.pug')
      .pipe(pug())
      .pipe(gulp.dest('./dist/'))
      .pipe(reload({
        stream: true
      }));
  });

  //watch images change
  watch('./src/img/**/*.{svg, jpg, png, gif}', function() {
    console.log('image changed');
    gulp.src('./src/img/**/*')
      .pipe(gulp.dest('./dist/img/'));
  })
});

gulp.task('js-prepare', function() {
  gulp.src('./src/js/**/*')
    .pipe(gulp.dest('./dist/js/'));
})

//all images from sources to production
gulp.task("images-to-dist", function() {
  gulp.src("./src/img/**/*")
    .pipe(gulp.dest("./dist/img/"));
});

//prepare less files for development enviroment
gulp.task('less-prebuild', function() {
  gulp.src("./src/less/**/*.less")
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(sourcemaps.write())
    .pipe(mincss())
    .pipe(concat("style.css"))
    .pipe(gulp.dest("./dist/css"));
})

gulp.task("fonts-prepare", function() {
  gulp.src("./node_modules/bootstrap/fonts/**/*")
    .pipe(gulp.dest("./dist/fonts/"));
  gulp.src("./fonts/**/*.{eot, svg, ttf, woff, woff2}")
    .pipe(gulp.dest("./dist/fonts/"));
  gulp.src('./node_modules/font-awesome/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts/'));
  gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task("normalize", function() {
  gulp.src("./src/css/normalize.css")
    .pipe(gulp.dest("./dist/css"));
});
gulp.task("bootstrap-prepare", function() {
  gulp.src("./node_modules/bootstrap/dist/css/bootstrap.min.css")
    .pipe(gulp.dest("./dist/css"));
  gulp.src("./node_modules/bootstrap/dist/js/bootstrap.min.js")
    .pipe(gulp.dest("./dist/js"));
  gulp.src("./node_modules/jquery/dist/jquery.min.js")
    .pipe(gulp.dest("./dist/js"));
});


gulp.task('less', function() {
  return gulp.src('./**/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest("dist/css"))
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch("*.html").on("change", reload);
});

// Get one .haml file and render 
gulp.task('one', function() {
  gulp.src('./src/haml/index.haml')
    .pipe(haml())
    .pipe(gulp.dest('./dist'));
});


// Get all .haml files in one folder and render 
gulp.task('folder', function() {
  gulp.src('./haml/blue/*.haml')
    .pipe(haml())
    .pipe(gulp.dest('./haml/blue'));
});



// Get and render all .haml files recursively 
gulp.task('haml', function() {
  gulp.src('./haml/**/*.haml')
    .pipe(haml())
    .pipe(gulp.dest('./haml'));
});



// Options 
// Change file extension 
gulp.task('ext', function() {
  gulp.src('./haml/**/*.haml')
    .pipe(haml({
      ext: '.php'
    }))
    .pipe(gulp.dest('./php'));
});

gulp.task("css", function() {
  gulp.src("./node_modules/bootstrap/dist/css/bootstrap.min.css")
    .pipe(gulp.dest('./dist/css/'));
});
