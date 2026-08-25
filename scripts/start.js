const { spawn } = require("child_process");
const { createServer } = require("net");
const os = require("os");
const path = require("path");

function getLanAddress() {
  const interfaces = os.networkInterfaces();

  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family === "IPv4" && !entry.internal && entry.address) {
        return entry.address;
      }
    }
  }

  return "127.0.0.1";
}

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.once("error", () => {
      server.close();
      findAvailablePort(startPort + 1).then(resolve, reject);
    });

    server.listen(startPort, "0.0.0.0", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function start() {
  const lanAddress = getLanAddress();
  const port = 8082;
  const lifecycle = process.env.npm_lifecycle_event;
  const platformFlag = ["android", "ios", "web"].includes(lifecycle)
    ? `--${lifecycle}`
    : null;
  const expoCli = require.resolve("expo/bin/cli");

  const environment = {
    ...process.env,
    EXPO_PUBLIC_API_URL:
      process.env.EXPO_PUBLIC_API_URL ||
      `http://${lanAddress}/receipt-iq/api`,
  };

  console.log(`LAN address: ${lanAddress}`);
  console.log(`Expo port: ${port}`);
  console.log(`API URL: ${environment.EXPO_PUBLIC_API_URL}`);

  const expo = spawn(
    process.execPath,
    [expoCli, "start", "--lan", "--port", String(port), ...(platformFlag ? [platformFlag] : [])],
    { stdio: "inherit", env: environment }
  );

  expo.on("exit", (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0);
  });
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});