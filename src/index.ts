import Knex from 'knex'

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
    /*try {
        let out = await knex.raw(`USE couch_gaming`);
        out = await knex.raw('DESCRIBE Test');
        console.log('Success: ' + JSON.stringify(out[0], null, 3));
        knex.destroy();
    } catch (error) {
        console.log('Error: ' + JSON.stringify(error, null, 3));
        knex.destroy();
    }*/

    /*try {
        let out = await knex.raw(`SELECT A.CONSTRAINT_TYPE, A.CONSTRAINT_NAME, B.COLUMN_NAME, B.REFERENCED_TABLE_NAME, B.REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS A
            LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE B ON A.CONSTRAINT_NAME = B.CONSTRAINT_NAME
            WHERE A.TABLE_SCHEMA = 'couch_gaming' AND A.TABLE_NAME = 'Test'
                AND B.TABLE_NAME = 'Test'`);
        console.log(JSON.stringify(out[0], null, 2));
        knex.destroy();
    } catch (error) {
        console.log('Error: ' + JSON.stringify(error, null, 3));
        knex.destroy();
    }*/
    async function getMany (conditions: Array<{fn: string, params: Array<any>}>, limit?, skipTo?): 
        Promise<{data: Array<any>, skipped_to: number, total_records: number}> 
    {
        let result = {data: [], skipped_to: 0, total_records: 150};
        
        let handle = knex.select('CONSTRAINT_TYPE', 'CONSTRAINT_NAME').from('INFORMATION_SCHEMA.TABLE_CONSTRAINTS');
        for (let condition of conditions) {
            handle[condition.fn](...condition.params);
        }
        
        result.data = (await handle);
        console.log(JSON.stringify(result.data, null, 2));

        return result;
    }

    await getMany([
        {fn: "where", params: [{TABLE_SCHEMA: "couch_gaming", TABLE_NAME: "Test"}]}
    ]);

    knex.destroy();
})();

/*import { Database } from "./Database";
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
    const diff_arr = database.getDiff();
    console.log(JSON.stringify(diff_arr, null, 2));
    database.destroy();
})();*/