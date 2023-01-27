# DB Manager

Library to manage databases for any couch application.
Documentation can be found in notion.

## Functionality

- Provides application level schema that can be used to create database tables.
- Provides subtable functionanlity to expand on the main table (Can be used for common tables that required for a specific dataset)

## Application Level Schema

Table:
```typescript
interface TableSchema {
    name: string;
    columns: Array<ColumnSchema>;
}
```

Column:
```typescript
enum Constraints {
    UNIQUE_KEY = "unique_key",
    PRIMARY_KEY = "primary_key",
    NOT_NULL = "not_null",
    AUTO_INCREMENT = "auto_increment"
}

interface ColumnSchema {
    name: string;
    type: {name: string, options: any};
    constraints: Array<Constraints>;
    foreign?: {table: string, column: string};
    default?: any;
}
```

"default" is of type "any" so we can pass knex functions as well especially for UUIDs and current time.

## Datatypes

String:
```typescript
const type = {
    name: "string",
    options: {
        limit: 255
    }
}
```

Number:
```typescript
const type = {
    name: "number",
    options: {
        size: "tiny|small|medium|normal|big",
        type: "float|int"
        unsigned: false
    }
}
```

Enum:
```typescript
const type = {
    name: "enum",
    options: {
        enums: ["string_1", "string_2"],
    }
}
```

Datetime:
```typescript
const type = {
    name: "datetime"
}
```

## Classes

### DBConfig
Holds database configuration and provides a way to access knex database objects.
- constructor({host, port, user, pass})
- testConnection() throws error
    - If connection fails throws error
- getDatabaseHandle: Knex (db_name: string)
    - Returns "Knex" object to interact with the database. Using "*" as the db_name will return "Knex" object without any database selected. 
- destroy(db_name?: string)
    - Destroys all "Knex" objects if db_name is not provided else destroys that particular db_name object.

### SubTable

- constructor(schema_handle: (parent_schema: TableSchema) => TableSchema)
- createIfNotExists (parent_schema: TableSchema, knex_handle: Knex)
    - Creates a table using schema information of the parent table. It automatically changes the table name concating its parent's name as such: `$(parent table name)_(subtable name)`.
    - If table exists, nothing will happen.

### Table

- constructor(table_schema: TableSchema, sub_tables: SubTable[])
- createIfNotExists(db_name: string, db_config: DBConfig)
    - Creates a table using its table schema. Creates all sub tables as well.
    - If table exists, it will proceed to create sub tables.


#### NOTE

DB Manager is built on top of knex query builder. Any code solely written for db manager functionality will not and should not be used to run on production. At least not in this state where its highly unstable. The point of DB Manager is to provide internal functionality to the organization, it will only be used in development phase (when the table schema and all is not finalized) during maintanence to setup or upgrade the product.