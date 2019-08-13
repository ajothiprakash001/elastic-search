const { createLogger, format, transports } = require('winston');
var fs = require( 'fs' );
var path = require('path');
var logDir = 'logs'; // directory path you want to set
if ( !fs.existsSync( logDir ) ) {
    // Create the directory if it does not exist
    fs.mkdirSync( logDir );
}

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'info',
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.File({ filename: 'logs/app.logs'})
  ]
});

module.exports = logger;