module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			my_target: {
				files: [{
					expand: true,
					//相对路径                      
					cwd: 'mycontrol',
					src: '*.js',
					dest: 'control'
				}]
			}
		},

		watch: {
			files: ['mycontrol/*.js', ],
			tasks: ['jshint']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('test', ['uglify']);
	grunt.registerTask('default', [ 'uglify']);

};