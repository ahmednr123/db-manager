import { Knex } from "knex";
import { Constraints, TableSchema } from "./Table";
import TypeProcedureSupport, { TypeProcedure } from "./type_procedures";

export default {
    commitTable: async (table_schema: TableSchema, knex_handle: Knex) => {
        let raw_cmds: Array<(knex: Knex) => Promise<void>> = [];
        
        await knex_handle.schema.createTable(table_schema.name, (table) => {
            for (let col of table_schema.columns) {
                let type_procedure: TypeProcedure = TypeProcedureSupport.getTypeProcedure(col.type.name, col.name, col.type.options, col.default);
                type_procedure.knex_handle.create(table, col.name);

                // constraints
                for (let constraint of col.constraints) {
                    switch (constraint) {
                    case Constraints.NOT_NULL:
                        table.setNullable(col.name);
                        break;
                    case Constraints.PRIMARY_KEY:
                        table.primary([col.name]);
                        break;
                    case Constraints.UNIQUE_KEY:
                        table.unique([col.name]);
                        break;
                    case Constraints.AUTO_INCREMENT:
                        //auto_increment (add to an array to run knex.raw commands later)
                        raw_cmds.push(async function (knex: Knex) {
                            // Check if default is required while doing this
                            await knex.raw(`ALTER TABLE ${table_schema.name} MODIFY COLUMN ${type_procedure.getMySQLType()} auto_increment`);
                        });
                        break;
                    }
                }

                // foreign
                if (col.foreign) {
                    table.foreign(col.name).references(`${col.foreign.table}.${col.foreign.column}`);
                }
            }
        });

        for (let raw_cmd of raw_cmds) {
            await raw_cmd(knex_handle);
        }
    }
}