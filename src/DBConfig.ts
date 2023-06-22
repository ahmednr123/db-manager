import Knex from "knex";

export class DBConfig {
  host: string;
  port: number;
  user: string;
  pass: string;

  handles: Map<string, any>; // Knex handles

  constructor({
    host,
    port,
    user,
    pass,
  }: {
    host: string;
    port: number;
    user: string;
    pass: string;
  }) {
    this.host = host;
    this.port = port;
    this.user = user;
    this.pass = pass;
    this.handles = new Map();
  }

  async testConnection() {
    // Maybe remove initialization, connection test
    let knex = Knex({
      client: "mysql",
      connection: {
        host: this.host,
        port: this.port,
        user: this.user,
        password: this.pass,
      },
    });

    try {
      await knex.raw("SHOW DATABASES");
      this.handles.set("*", knex);
    } catch (error) {
      console.log("Error: " + JSON.stringify(error, null, 2));
      throw new Error("Error connecting to DB");
    }
  }

  getDatabaseHandle(db_name: string, ssl?: boolean) {
    let dbHandle = this.handles.get(db_name);
    if (!dbHandle) {
      let connection: any = {
        host: this.host,
        port: this.port,
        user: this.user,
        password: this.pass,
      };

      if (ssl && ssl === true) connection.ssl = { rejectUnauthorized: true };

      if (db_name != "*") connection.database = db_name;

      // Add pools nd all later
      dbHandle = Knex({ client: "mysql", connection });
      this.handles.set(db_name, dbHandle);
    }
    return dbHandle;
  }

  destroy(db_name?: string) {
    if (db_name == "*") {
      throw new Error("Cannot destroy * db connection");
    }

    if (db_name) {
      let handle = this.handles.get(db_name);
      if (handle) handle.destroy();
      return;
    }

    let k;
    let iter: IterableIterator<any> = this.handles.keys();
    while ((k = iter.next()) && !k.done) {
      this.handles.get(k.value).destroy();
    }
  }
}
