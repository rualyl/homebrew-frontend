const http = require('http')
const fs = require('fs')

const fd = fs.openSync('/sys/bus/w1/devices/28-0114380a50aa/w1_slave')

http.createServer((req, res) => {
	res.setHeader('Content-Type', 'text/plain');
	var buffer = Buffer.alloc(80);
	fs.read(fd, buffer, 0, 80, 0, (err, bytesRead, buf) => {
		var text = buf.toString('utf8')
		var lines = text.split('\n');
		if (lines[0].length != 39) {
			res.end('bad crc')
		}
		else {
			var milliC = lines[1].slice(-5);

			res.end(`${milliC} mC => ${(milliC/1000.0)*(9.0/5.0) + 32.0} F`);
		}
		//res.end(`${lines[0].length}`);
		//res.end(`${lines[0]}-----${lines[1]}`);
	});
}).listen(3001, '0.0.0.0', () => {console.log(`Server running on port ${3001}`);});
