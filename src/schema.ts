/*
{
    table_name: "",
    columns: [
        {
            name: "",
            type: "",
            length: "",
            default: "",
            constraints: [PRIMARY_KEY, AUTO_INCREMENT, NOT_NULL],
            foreign: {
                table: "",
                column: ""
            }
        },
        {
            name: "",
            type: "enum",
            enums: ["", "", ""],
            additional_config: [NOT_NULL],
            foreign: {
                table: "",
                column: ""
            }
        },
    ]
}
*/

const UserSchema = {
    table_name: "users",
    columns: [
        {
            name: "name",
            type: "string",
            length: 20
        },
        {
            name: "email",
            type: "string",
            length: 30,
            constraints: ['PRIMARY_KEY', 'NOT_NULL']
        },
        {
            name: "phone",
            type: "string",
            length: "15"
        },
        {
            name: "role",
            type: "enum",
            enums: ["USER", "HELPER", "ADMIN", "SUPER_ADMIN"]
        }
    ]
    }
    
    const AuthTypeSchema = {
    table_name: "auth_type",
    columns: [
        {
            name: "user",
            foreign: {
                table: "users",
                column: "email"
            }
        },
        {
            name: "provider",
            type: "enum",
            enums: ["GOOGLE", "APPLE"]
        }
    ]
    }
    
    interface ColumnBuilder {
    
    }
    
    //This is crap, make a proper builder.
    const dataTypeKnex = (table, column_name, datatype, _enums) => {
        switch (datatype) {
        case 'string': 
            return table.string(column_name);
        case 'integer':
            return table.integer(column_name);
        case 'boolean':
            return table.boolean(column_name);
        case 'enum':
            return table.enu(column_name, _enums);
        default:
            throw new Error(`${datatype} not found!`);
        }
    }
    
    // Write code to properly organize tables in an array
    // If there are circular dependencies update one foreign column later.
    
    // Ignore the above, no need of organizing, just start commiting the tables.
    
    const commitColumn = (table_handle, column, tables_commited) => {
        if (!column.foreign 
            || tables_commited.includes(column.foreign.table)
        ) {
            dataTypeKnex(
                table_handle, 
                column.name, 
                column.type, 
                (column.type == 'enums') 
                    ? column.enums 
                    : null 
            );
        }
    }
    
    /*const commitTable = async (table, tables_commited) => {
        try {
        await knex.schema.createTable(table.name, 
            (table_handle) => {
                if (!table.columns) return;
                for (let column of table.columns) {
                    commitColumn(table_handle, column, tables_commited);
                }
            });
        } catch (err) {
            throw new Error(`Error creating table: ${table.name}`);
        }
    }
    
    const commitDatabase = async (database_tables: Array<any>) => {
        let i = 0;
        const tables_commited: Array<string> = [];
        while (tables_commited.length < database_tables.length) {
            await commitTable(database_tables[i++], tables_commited);
        }
    }*/