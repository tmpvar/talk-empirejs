var
  ecstatic = require('ecstatic')(__dirname),
  spawn = require('child_process').spawn;

require('http').createServer(ecstatic).listen(10000);

require('binaryjs').createServer(function(conn) {
  console.log(spawn('bash'));
  var child = spawn('bash');
  child.stdout.pipe(conn);
  child.stdout.pipe(conn);
  conn.pipe(child.stdin);
}).listen(10001),

require('open')('http://localhost:10000');