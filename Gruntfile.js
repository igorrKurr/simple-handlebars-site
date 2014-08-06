module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    vendorJs: Object.keys(grunt.file.readJSON('bower.json').dependencies).map(
      function(prodComponent) {
          return 'vendor/**/' + prodComponent.replace(/\-/, '.') + "+(.min|-min).js";
      }
    ),
    vendorCss: Object.keys(grunt.file.readJSON('bower.json').dependencies).map(
      function(prodComponent) {
          return 'vendor/**/' + prodComponent.replace(/\-/, '.') + ".css";
      }
    ),
    concat: {
      app: {
        src: ['app/js/**/*.js'],
        dest: 'build/app.js'
      },
      assetsJs:{
        options: {
          stripBanners: {block:true}
        },
        src: '<%= vendorJs%>',
        dest: 'build/assets/assets.js'
      },
      assetsCss: {
        src: ['<%= vendorCss%>', 'vendor/**/font-awesome.css'],
        dest: 'build/assets/assets.css'
      },
      styles: {
        src: "app/styles/**/*.css",
        dest: 'build/app.css'
      },
      test: {
        src: ['<%= concat.assetsJs.dest%>', 'build/templates.js', '<%= concat.app.dest%>', ],
        dest: 'test/app.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'build/app.min.js': ['<%= concat.app.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'app/js/**/*.js', 'test/**/*.js', '!test/app.js'],
    },
    watch: {
      all: {
        files: ['<%= jshint.files %>', 'app/index.html'],
        tasks: 'build',
        options: {
          livereload: true
        }
      }
    },
    express: {
      all:{
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          bases: 'build',
          livereload: true
        }
      }
    },
    open: {
      all: {
          path: 'http://localhost:<%= express.all.options.port %>'
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'build/index.html': 'app/index.html'
        }
      }
    },
    handlebars: {
      options: {
        namespace: 'LoT.Templates',
        processName: function(filePath) {
          return filePath.replace(/^app\/templates\//, '').replace(/\.hbs$/, '');
        }
      },
      all: {
        files: {
          "build/templates.js": ["app/templates/**/*.hbs"]
        }
      }
    },
    copy: {
      font_awesome: {
        expand: true,
        flatten: true,
        src: ['vendor/components-font-awesome/fonts/*'],
        dest: 'build/assets/fonts'
      },
      app_fonts: {
        expand: true,
        flatten: true,
        src: ['app/styles/fonts/*'],
        dest: 'build/assets/fonts'
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'app/images/',
          src: ['**/*.{png,jpg,gif,jpeg}'],
          dest: 'build/assets/images/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('test', ['jshint', 'concat', 'qunit']);
  grunt.registerTask('build', ['jshint', 'concat', 'copy', 'newer:imagemin', 'newer:handlebars', 'qunit', 'newer:uglify', 'newer:htmlmin']);
  grunt.registerTask('serve', ['build', 'express','open', 'watch']);
  grunt.registerTask('default', ['jshint', 'concat','qunit', 'uglify', 'concat_css']);
};