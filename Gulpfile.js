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

gulp.task('default', ['images-to-dist', 'fonts-prepare', 'pug'], function() {
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
  watch("./src/img/*.{png, svg, gif, jpg}", function() {
    return gulp.src("./src/img/*.{png, svg, gif, jpg}")
      .pipe(gulp.dest("./dist/img"));
  });

  //reload if dist file is changed
  gulp.watch("./dist/css/style.css").on("change", reload);

  //watch for less files
  watch("./src/less/*.less", function() {
    console.log("less changed")
    return gulp.src("./src/less/main.less")
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(sourcemaps.write())
      .pipe(mincss())
      .pipe(concat("style.css"))
      .pipe(gulp.dest("./dist/css"));
  });

  watch('./src/pug/**/*.pug', function() {
    console.log('pug files compiled to html');
    return gulp.src('./src/pug/**/*.pug')
      .pipe(pug())
      .pipe(gulp.dest('./dist'));
  })
});

gulp.task('pug', function() {
  console.log('pug files compiled to html');
  return gulp.src('./src/pug/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./dist'));
});

//all images from sources to production
gulp.task("images-to-dist", function() {
  gulp.src("./src/img/**/*.{png, gif,svg, jpg}")
    .pipe(gulp.dest("./dist/img"));
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
  gulp.src("./bower_components/bootstrap/less/glyphicons.less")
    .pipe(gulp.dest("./src/less"));
  gulp.src("./bower_components/bootstrap/less/variables.less")
    .pipe(gulp.dest("./src/less"));
  gulp.src("./bower_components/bootstrap/fonts/*.{eot, svg, ttf, woff, woff2")
    .pipe(gulp.dest("./dist/font/"))
})


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
  gulp.src("./bower_components/bootstrap/dist/css/bootstrap.min.css")
    .pipe(gulp.dest('./dist/css/'));
});
