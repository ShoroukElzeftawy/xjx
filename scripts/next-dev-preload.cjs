const os = require("os");
const semver = require("next/dist/compiled/semver");
if (semver && typeof semver.satisfies === "function" && !semver.default) {
  semver.default = semver;
}

const origIfaces = os.networkInterfaces.bind(os);
os.networkInterfaces = () => {
  try {
    return origIfaces() || {};
  } catch {
    return {};
  }
};
