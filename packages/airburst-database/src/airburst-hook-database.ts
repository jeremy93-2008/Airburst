import knex from "knex";

export async function getTablesName(db: knex<any, unknown[]>, name: string, driver: string) {
    return await getSQLTable(db, name, driver);
}

async function getSQLTable(db: knex<any, unknown[]>, name: string, driver: string) {
    switch(driver) {
        case "mssql": return (await db.raw(`select table_name from information_schema.tables where table_schema = '${name}' and table_catalog = ?`))[0];
        case "mysql": return (await db.raw(`select table_name as name from information_schema.tables where table_schema = '${name}'`))[0];
        case "sqlite3": return await db.raw("SELECT name FROM sqlite_master WHERE type='table';");
        case "postgres": return (await db.raw(`select table_name as name  from information_schema.tables where table_schema = '${name}' and table_catalog = ?`))[0];
        case "oracle": return (await db.raw("select table_name as name from user_tables"))[0];
    }
}