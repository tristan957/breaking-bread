import App from "./App";

new App()
    .setUp()
    .then(app => {
        console.log(app.connection.isConnected);
        app.run();
    });
