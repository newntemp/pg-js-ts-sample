/**
 * I used sequelize only because I'm familiar with it and its easy to get a connection
 */
import { BindOrReplacements, Sequelize } from "sequelize";

type DBMetadata = unknown;
type QueryResults<T> = Promise<[T[], DBMetadata]>;

export const REPORTS_TABLE_NAME = "reports";
export const PAGES_TABLE_NAME = "pages";
export const DOCS_TABLE_NAME = "documents";

export class Database {

  public static getConnection(): Sequelize {
    const port = parseInt(Database.parseEnvVar("PG_PORT"), 10);
    return new Sequelize(
        Database.parseEnvVar("PG_DB_NAME"),
        Database.parseEnvVar("PG_USER"),
        Database.parseEnvVar("PG_PASS"),
        {
          host: Database.parseEnvVar("PG_HOST"),
          dialect: "postgres",
          port
        }
      );
  }

  public static execute<T>(query: string, replacements?: BindOrReplacements): QueryResults<T> {
    //For convenience in this exercise
    //Probably don't want to make a new connection for every request. EX transactions
    const conn = Database.getConnection();
    return conn.query(query, {raw: true, replacements}) as QueryResults<T>;
  }

  // would be better if the tables were created in a migration step
  public static async createTables(): Promise<void> {
    const createPagesSql = `CREATE TABLE IF NOT EXISTS ${PAGES_TABLE_NAME} (
      id INTEGER PRIMARY KEY,
      document_id INTEGER,
      body TEXT,
      footnote TEXT
    )`;
    await Database.execute(createPagesSql);

    const createDocsSql = `CREATE TABLE IF NOT EXISTS ${DOCS_TABLE_NAME} (
      id INTEGER PRIMARY KEY,
      report_id INTEGER,
      name TEXT,
      fileType TEXT
    )`;
    await Database.execute(createDocsSql);

    const createReportsSql = `CREATE TABLE IF NOT EXISTS ${REPORTS_TABLE_NAME} (
      id INTEGER PRIMARY KEY,
      title TEXT
    )`;
    await Database.execute(createReportsSql);
  }

  /**
   * Returns the process' environment value for `name`.
   * Throws Error if `name` does not have a value.
   *
   * Belongs in a utils package
   */
  public static parseEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
      //check the .env
      throw new Error(`Environment variable "${name}" was not found`);
    }
    return value;
  }
}
