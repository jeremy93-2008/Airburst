import knex from "knex";
import { dbKnex } from "../src/airburst";

interface IColumnInfo {
    [x: string]: knex.ColumnInfo
}

class Table {
    constructor(private tableName: string) {
        console.log(tableName)
    }

    async columns() {
        if(!dbKnex) return;
        const columnsInfo = await dbKnex(this.tableName).columnInfo() as unknown as IColumnInfo;
        return Object.keys(columnsInfo).map(key => key);
    }

    async data() {
        if(!dbKnex) return;
        return dbKnex(this.tableName).select("*");
    }
}

export function getRoot(tablesName: string[]) {
    const root: any = {};
    tablesName.map((name) => {
        root[name] = () => new Table(name)
    })
    return root;
}