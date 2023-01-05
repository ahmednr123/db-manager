/*import Knex from 'knex'

const knex = Knex({
    client: "mysql",
    connection: {
        host: "localhost",
        port: 3306,
        user: "ahmed",
        password: "password",
    }
});

(async () => {
    try {
        let out = await knex.raw(`USE couch_gaming`);
        out = await knex.raw('DESCRIBE Test');
        console.log('Success: ' + JSON.stringify(out[0], null, 3));
        knex.destroy();
    } catch (error) {
        console.log('Error: ' + JSON.stringify(error, null, 3));
        knex.destroy();
    }
})();*/

import { Database } from "./Database";
import { DBConfig } from "./DBConfig";

const dbConfig = new DBConfig({
    host: "localhost",
    port: 3306,
    user: "ahmed",
    pass: "password"
});

(async() => {
    await dbConfig.testConnection();
    const database = new Database("couch_gaming", dbConfig);
    await database.init();
    database.getDiff();
})();