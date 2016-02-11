function TDError(code, message) {
  this.code = code;
  this.message = message;
  this.stack = (new Error()).stack;

  return this;
}

module.exports = TDError;
