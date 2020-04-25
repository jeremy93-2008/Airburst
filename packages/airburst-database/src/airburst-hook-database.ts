import knex from "knex";

export async function getTablesName(db: knex<any, unknown[]>, driver: string) {
    return await getSQLTable(db, driver);
}

async function getSQLTable(db: knex<any, unknown[]>, driver: string) {
    switch(driver) {
        case "mssql": return await db.raw('select table_name from information_schema.tables where table_schema = \'public\' and table_catalog = ?');
        case "mysql": return await db.raw("select table_name from information_schema.tables where table_schema = ?");
        case "sqlite3": return await db.raw("SELECT name FROM sqlite_master WHERE type='table';");
        case "postgres": return await db.raw("select table_name from information_schema.tables where table_schema = \'public\' and table_catalog = ?");
        case "oracle": return await db.raw("select table_name from user_tables");
    }
}