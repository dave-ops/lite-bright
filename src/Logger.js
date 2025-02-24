// src/logger.js
const LogConfig = require('./logConfig');
const DebugLevel = require('./levels/debugLevel');
// Import other levels...

class Logger {
  constructor(env = process.env.NODE_ENV || 'development', options = {}) {
    this._env = env;
    const envLogLevel = process.env.LOG_LEVEL;
    if (envLogLevel !== undefined && envLogLevel !== null) {
      const levelNum = parseInt(envLogLevel, 10);
      if (!isNaN(levelNum) && levelNum >= 0 && levelNum <= LogConfig.Levels.CRITICAL) {
        this._level = levelNum;
      } else {
        this._level = env === 'production' ? LogConfig.Levels.ERROR : LogConfig.Levels.DEBUG;
      }
    } else {
      this._level = env === 'production' ? LogConfig.Levels.ERROR : LogConfig.Levels.DEBUG;
    }
    this.levels = {
      debug: new DebugLevel(),
      // Initialize other levels...
    };
    // Plugin options
    this.formatter = options.formatter || ((msg, level) => level.formatMessage(msg));
    this.output = options.output || { log: console.log.bind(console) };
  }

  get level() {
    return this.toLevel(this._level);
  }

  set level(level) {
    this._level = level;
  }

  toLevel(levelNumber) {
    // Existing implementation...
  }

  log(logLevel, message) {
    if (logLevel.shouldLog(this._level)) {
      const formattedMessage = this.formatter(message, logLevel);
      this.output.log(formattedMessage);
    }
  }

  debug(message) {
    this.log(this.levels.debug, message);
  }

  // Other methods (info, warn, etc.) remain unchanged...

  close() {
    if (this.output.close) {
      this.output.close();
    }
  }
}

module.exports = Logger;