module.exports = function (grunt) {
	require('grunt-dojo2').initConfig(grunt, {
		copy: {
			staticDistFiles: {
				files: [
					{ src: 'package.json', dest: 'dist/umd/package.json' }
				]
			},
			staticDevFiles: {
				files: [
					{ src: 'package.json', dest: '_build/package.json' }
				]
			}
		}
	});

	grunt.registerTask('ci', [
		'intern:node'
	]);

	grunt.registerTask('dist', grunt.config.get('distTasks').concat(['copy:staticDistFiles']));
	grunt.registerTask('dev', grunt.config.get('devTasks').concat(['copy:staticDevFiles']));
};
