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

    async columns() {
        if(!dbKnex) return;
        const columnsInfo = await dbKnex(this.tableName).columnInfo() as unknown as IObject<knex.ColumnInfo>;
        return Object.keys(columnsInfo).map(key => key);
    }

    async data(name?: string) {
        if(!dbKnex) return;
        return dbKnex(this.tableName).select(name ? name : "*");
    }
}

async function getTableType(currentTable: Table) {
    const cols = await currentTable.columns();
    const fields: IObject<any> = {};
    cols?.forEach(name => {
        fields[name] = {
            type: graphql.GraphQLString
        }
    })
    console.log({name: "Table", fields })
    return new graphql.GraphQLObjectType({name: "Table", fields });
}

async function getQueryType(tablesName: string[]) {
    const query = {name: "Query", fields: {}};
    tablesName.forEach(async (name) => {
        const currentTable = new Table(name);
        (query.fields as IObject<any>)[name] = {
            type: new graphql.GraphQLList(await getTableType(currentTable)),
            resolve: () => currentTable
        }
    });
    console.log(query)
    return new graphql.GraphQLObjectType(query);
}


export async function getScheme(tablesName: string[]) {
    return new graphql.GraphQLSchema({query: await getQueryType(tablesName)});
}