const Module = require("module");
const os = require("os");

const origLoad = Module._load;
Module._load = function loadPatched(request, parent, isMain) {
  const exported = origLoad.apply(this, arguments);
  if (
    typeof request === "string" &&
    request.includes("compiled/semver") &&
    exported &&
    typeof exported.satisfies === "function" &&
    !exported.default
  ) {
    exported.default = exported;
  }
  return exported;
};

const origIfaces = os.networkInterfaces.bind(os);
os.networkInterfaces = () => {
  try {
    return origIfaces() || {};
  } catch {
    return {};
  }
};
