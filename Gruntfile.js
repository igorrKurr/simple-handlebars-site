  /*jshint camelcase: false */

'use strict';
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
        src: '<%= vendorJs %>',
        dest: 'build/assets/assets.js'
      },
      test: {
        src: ['<%= concat.assetsJs.dest%>', 'build/templates.js', '<%= concat.app.dest%>', ],
        dest: 'test/app.js'
      }
    },
    wiredep: {
      target: {
        src: 'app/index.html'
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
      options: {
        jshintrc: true
      }
    },
    watch: {
      options: {
        livereload: 35729
      },
      all: {
        files: ['<%= jshint.files %>', 'app/index.html', 'app/styles/*', 'app/templates/*'],
        tasks: 'build'
      },
      bower: {
        files: ['bower.json'],
        tasks: 'wiredep'
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          base: [
            './'
          ]
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>/build/'
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
      app_fonts: {
        expand: true,
        flatten: true,
        src: ['app/styles/fonts/*'],
        dest: 'build/assets/fonts'
      },
      app:{
        expand: true,
        flatten: true,
        src: ['app/index.html'],
        dest: 'build/'
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
    },
    concat_css: {
      app: {
        files: {
          'build/app.css':['app/styles/**/*.css']
        }
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
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.registerTask('test', ['jshint', 'concat', 'qunit']);
  grunt.registerTask('build', ['jshint', 'wiredep', 'concat', 'concat_css', 'copy', 'newer:imagemin', 'newer:handlebars', 'qunit', 'newer:uglify', 'newer:htmlmin']);
  grunt.registerTask('serve', ['build', 'connect', 'open', 'watch']);
  grunt.registerTask('default', ['jshint', 'concat','qunit', 'uglify', 'concat_css']);
};