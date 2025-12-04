import sql, { ConnectionPool } from "mssql";

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: ConnectionPool | undefined;
}

export interface DbConfig {
  connectionString: string;
}

const getConfig = (): DbConfig => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  return { connectionString };
};

export const getDbPool = async (): Promise<ConnectionPool> => {
  if (global.__dbPool) {
    return global.__dbPool;
  }

  const { connectionString } = getConfig();

  const pool = await sql.connect(connectionString);
  
  global.__dbPool = pool;
  return pool;
};

export const closeDbPool = async (): Promise<void> => {
  if (global.__dbPool) {
    await global.__dbPool.close();
    global.__dbPool = undefined;
  }
};


