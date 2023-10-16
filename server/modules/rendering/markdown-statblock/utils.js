const safeValue = (value) => {
  if (value === undefined) return "";
  if (value === null) return "";
  return value;
}

module.exports = safeValue;