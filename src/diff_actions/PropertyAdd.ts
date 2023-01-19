import { Knex } from "knex";
import { IDiffAction } from ".";
import { Diff } from "../SchemaDiffer";
import { handleAlterKnexConstraints } from "./ConstraintAdd";

function commit (knex: Knex, diff: Diff) {
    knex.schema.table(diff.table, async (table) => {
        switch (diff.property) {
            case 'name':
            case 'type':
                throw new Error('Bruh! You really need to check the code, this shouldnt be happening!');
            case 'size':
                //if (diff.)
                table.string(diff.column, diff.value as number);
                break;
            case 'constraints':
                handleAlterKnexConstraints(table, diff.value as Array<string>, diff);
                break;
            case 'enums':
                table.enum(diff.column, diff.column_schema.enums);
                break;
            case 'foreign':
                const value = diff.value as {table:string, column:string};
                table.foreign(diff.column)
                    .references(`${value.table}.${value.column}`);
                break;
            case 'default':
                
        }
    });
}

/**
 * {
    name: string;
    type: IDataType;
    size?: number; //For now the only reason this makes sense is for string.
    //adding a size to varchar doesn't really do much but provide limit check.
    constraints?: Array<Constraints>;
    enums?: Array<string | number>;
    foreign?: {table: string, column: string};
    default?: any;
}
 */

/**
 * Properties:
 * name
 * type
 * size
 * constraints
 * enums
 * foreign
 * default
 */

const action: IDiffAction = { commit };

export default action;