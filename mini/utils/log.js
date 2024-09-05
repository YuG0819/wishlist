class Log {
  static debug(tag, message) {
    console.debug(`[DEBUG] ${tag}: ${message}`);
  }

  static info(tag, message) {
    console.info(`[INFO] ${tag}: ${message}`);
  }

  static warn(tag, message) {
    console.warn(`[WARN] ${tag}: ${message}`);
  }

  static error(tag, message) {
    console.error(`[ERROR] ${tag}: ${message}`);
  }
}

module.exports = Log