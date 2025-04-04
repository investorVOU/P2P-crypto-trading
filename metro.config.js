// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const config = getDefaultConfig(__dirname);
  
  // Add any customizations here
  
  return config;
})();
