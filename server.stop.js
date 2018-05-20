const io = require("socket.io-client");
const socketClient = io.connect("https://localhost:6443", {
    query: { token: process.env.SOCKET_TOKEN },
    secure: true,
    rejectUnauthorized: false
});

socketClient.on("connect", () => {
    socketClient.emit("stop");
    console.log("[SERVER.STOP] Performing server stop...");

    setTimeout(() => {
        console.error("[SERVER.STOP] Fail. Server not stopped.");
	process.exit(1);	
    }, 3000);

    socketClient.on("disconnect", (reason) => {
        console.log("[SERVER.STOP] Success. Server stopped.");
	process.exit(0);
    });
});

socketClient.on('connect_error', (error) => {

    console.warn("[SERVER.STOP] The server is down. Nothing to stop.");
    process.exit(0);

});