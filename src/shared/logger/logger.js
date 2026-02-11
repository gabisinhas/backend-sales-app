function format(level, message, metadata = {}) {
  const timestamp = new Date().toISOString();

  const meta =
    Object.keys(metadata).length > 0
      ? JSON.stringify(metadata)
      : "";

  return `[${timestamp}] [${level}] ${message} ${meta}`;
}

export const logger = {
  info(message, metadata = {}) {
    console.log(format("INFO", message, metadata));
  },

  warn(message, metadata = {}) {
    console.warn(format("WARN", message, metadata));
  },

  error(message, metadata = {}) {
    console.error(format("ERROR", message, metadata));
  }
};
