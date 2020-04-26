import knex from "knex";
import graphql from "graphql";
import { dbKnex } from "../src/airburst";

type IGraphQLField = graphql.Thunk<graphql.GraphQLFieldConfigMap<any, any>>;
interface IObject<T> {
    [x: string]: T
}

class Table {
    constructor(private tableName: string) {
    }

    name() {
        return this.tableName;
    }

    async columns() {
        if(!dbKnex) return;
        const columnsInfo = await dbKnex(this.tableName).columnInfo() as unknown as IObject<knex.ColumnInfo>;
        return Object.keys(columnsInfo).map(key => key);
    }

    public async rows() {
        if(!dbKnex) return;
        const select = (await dbKnex(this.tableName).select("*"));
        return select;
    }
}

async function getDataType(currentTable: Table) {
    const cols = await currentTable.columns();
    const fields: IObject<any> = {};
    cols?.forEach(name => {
        fields[name] = {
            type: graphql.GraphQLString
        }
    })
    return new graphql.GraphQLObjectType({name: `Row_${currentTable.name()}`, fields });
}

async function getQueryType(tablesName: string[]) {
    const query = {name: "Query", fields: {}};
    await populateTableNameOnFields(tablesName, query);
    return new graphql.GraphQLObjectType(query);
}


async function populateTableNameOnFields(tablesName: string[], query: { name: string; fields: {}; }) {
    for(let i = 0; i < tablesName.length; i++) {
        const name = tablesName[i];
        const currentTable = new Table(name);
        (query.fields as IObject<any>)[name] = {
            type: new graphql.GraphQLList(await getDataType(currentTable)),
            resolve: () => currentTable.rows()
        };
    };
}

export async function getScheme(tablesName: string[]) {
    return new graphql.GraphQLSchema({query: await getQueryType(tablesName)});
}