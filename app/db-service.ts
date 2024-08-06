import * as SQLite from "expo-sqlite";
import { LogItem } from "../models";

const dbFileName = "montext";
const tableName = "tabletextbk";

export const getDBConnection = async () => {
    try {
        console.log("getDBConnection");
        return await SQLite.openDatabaseAsync(dbFileName);
    } catch (error) {
        console.log("getDBConnection ERR");
        console.log(error);
    }
  
};

export const genLogKey = (voyn: string, time: string) => {
    return parseInt(`${voyn}${time}`.replace(/\D/g, ''))
}

export const createTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        console.log(`start create table ${tableName} `);
         // create table if not exists
            const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
                name TEXT NOT NULL,
                voyn TEXT NOT NULL,
                time TEXT NOT NULL,
                vtl TEXT NOT NULL,
                vtm TEXT NOT NULL,
                vtg TEXT NOT NULL,
                kcl TEXT NOT NULL,
                kcm TEXT NOT NULL
            );`;

            await db.execAsync(query);
    } catch (error) {
        console.log("createTable", error);
    }
 
};

export const createTablebk = async (db: SQLite.SQLiteDatabase) => {
  try {
       // create table if not exists
          const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
              name TEXT NOT NULL,
              voyn TEXT NOT NULL,
              time TEXT NOT NULL,
              vtl REAL NOT NULL,
              vtm REAL NOT NULL,
              vtg REAL NOT NULL,
              kcl REAL NOT NULL,
              kcm REAL NOT NULL
          );`;

          await db.execAsync(query);
  } catch (error) {
      console.log("createTable", error);
  }

};


export const getTodoItems = async (
  db: SQLite.SQLiteDatabase
): Promise<LogItem[]> => {
  try {
    const results: LogItem[] = await db.getAllAsync(
      `SELECT rowid as id,value FROM ${tableName}`
    );
    console.log(results);

    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get todoItems !!!");
  }
};


export const getLogs = async (
    db: SQLite.SQLiteDatabase
  ): Promise<LogItem[]> => {
    try {
        console.log("getAllAsync getLogs");
      const results: LogItem[] = await db.getAllAsync(
        `SELECT rowid as id, * FROM ${tableName}`
      );
      console.log("get all db service", results);
      return results;
    } catch (error) {
      console.error(error);
      throw Error("Failed to get getLogs !!!");
    }
  };

export const saveLogItems = async (db: any, todoItems: LogItem[]) => {
    try {
        const insertQuery =
        `INSERT OR REPLACE INTO ${tableName} (rowid, name, voyn, time, vtl, vtm, vtg, kcl, kcm)  values` +
        todoItems.map(i => `(${i.id}, '${i.name}', '${i.voyn}', '${i.time}', '${i.vtl}', '${i.vtm}', '${i.vtg}', '${i.kcl}', '${i.kcm}')`).join(',');
        console.log(insertQuery);
        const result = await db.runAsync(insertQuery);
        console.log(result.lastInsertRowId, result.changes);
    } catch (error) {
        console.log("save log items error", error);
    }
  
};

export const saveLogItemsbk = async (db: any, todoItems: LogItem[]) => {
  try {
      const insertQuery =
      `INSERT OR REPLACE INTO ${tableName} (rowid, name, voyn, time, vtl, vtm, vtg, kcl, kcm)  values` +
      todoItems.map(i => `(${i.id}, '${i.name}', '${i.voyn}', '${i.time}', ${i.vtl}, ${i.vtm}, ${i.vtg}, ${i.kcl}, ${i.kcm})`).join(',');
      console.log(insertQuery);
      const result = await db.runAsync(insertQuery);
      console.log(result.lastInsertRowId, result.changes);
  } catch (error) {
      console.log("save log items error", error);
  }

};


export const deleteLogItem = async (db: any, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.runAsync(deleteQuery);
};

export const deleteTable = async (db: SQLite.SQLiteDatabase) => {
  const query = `drop table ${tableName}`;

  await db.runAsync(query);
};
