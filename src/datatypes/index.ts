import { Knex } from "knex";
import { ColumnSchema, TableSchema } from "../Table";
import BigInteger from "./BigInteger";
import Enum from "./BigInteger";
import Integer from "./BigInteger";
import String from "./BigInteger";

/*
    Didnt really take too much time designing a proper
    functional way to handle this. At this time it seems like
    a proper thing to do, sorry in advance, please feel free
    to update to a better design.

    Working code is of a higher priority than perfect code
    at the moment.
*/

export interface IDataType {
    matchDesc: (mysql_type: string) => boolean,
    parseDesc: (json_col_schema: ColumnSchema, mysql_col_schema: any) => void,

    create: (table: Knex.CreateTableBuilder, schema: ColumnSchema) => void,
    alter: (table: Knex.AlterTableBuilder, schema: ColumnSchema) => void
}

export const data_types: IDataType[] = [
    Enum,
    Integer,
    BigInteger,
    String
]