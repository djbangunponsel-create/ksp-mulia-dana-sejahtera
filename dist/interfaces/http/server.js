"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT || 8080;
const startServer = async () => {
    try {
        const app = await (0, app_1.createApp)();
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        return server;
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map