const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: "src/logs/info.log",
      level: "info",
    }),

    new transports.File({
      filename: "src/logs/error.log",
      level: "info",
    }),
    //if we want to see info in folder or file use below code
    /*
    //if we want to see info in console log use below code 
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    */
  ],
});

module.exports = logger;
