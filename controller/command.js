function runCommand(cmd) {
	var util = require('util')
	var exec = require('child_process').exec;
	var child;

	// executes `cmd`
	child = exec(cmd, function (error, stdout, stderr) {
	  util.print('stdout: ' + stdout);
	  util.print('stderr: ' + stderr);
	  if (error !== null) {
	    console.log('exec error: ' + error);
	  }
	});
}