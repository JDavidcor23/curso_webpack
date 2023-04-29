const fs = require("fs");

fs.writeFileSync("./.env", `API=${process.env.API}\n`); // esto nos permite crear un archivo .env con la variable de entorno API para el servidor en netlify
