const { Pool } = require("pg");

function getConnectionString() {
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!url) {
    throw new Error("Missing DATABASE_URL. Please set Supabase PostgreSQL connection string in environment variables.");
  }
  return url;
}

const pgPool = new Pool({
  connectionString: getConnectionString(),
  ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
});

function normalizeSql(sql) {
  let out = String(sql);

  // MySQL -> PostgreSQL helpers used by the old codebase.
  out = out.replace(/`/g, '"');
  out = out.replace(/\bNOW\(\)/gi, "CURRENT_TIMESTAMP");
  out = out.replace(/\bCURDATE\(\)/gi, "CURRENT_DATE");
  out = out.replace(/DATE\s*\(\s*([a-zA-Z0-9_.]+)\s*\)/gi, "$1::date");
  out = out.replace(/DATE_SUB\s*\(\s*CURRENT_TIMESTAMP\s*,\s*INTERVAL\s+(\d+)\s+DAY\s*\)/gi, "CURRENT_TIMESTAMP - INTERVAL '$1 days'");
  out = out.replace(/DATE_SUB\s*\(\s*NOW\(\)\s*,\s*INTERVAL\s+(\d+)\s+DAY\s*\)/gi, "CURRENT_TIMESTAMP - INTERVAL '$1 days'");

  // Convert MySQL boolean aggregation: SUM(role = 'student')
  out = out.replace(/SUM\s*\(\s*([a-zA-Z0-9_.]+)\s*=\s*'([^']+)'\s*\)/gi,
    "SUM(CASE WHEN $1 = '$2' THEN 1 ELSE 0 END)");
  out = out.replace(/SUM\s*\(\s*([a-zA-Z0-9_.]+)\s*=\s*"([^"]+)"\s*\)/gi,
    "SUM(CASE WHEN $1 = '$2' THEN 1 ELSE 0 END)");

  // MySQL LIKE is case-sensitive/collation-dependent; ILIKE is friendlier for Vietnamese search.
  out = out.replace(/\bLIKE\b/g, "ILIKE");

  // Replace ? placeholders with $1, $2... while ignoring question marks inside string literals.
  let index = 0;
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  let converted = "";

  for (const ch of out) {
    if (escaped) {
      converted += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      converted += ch;
      escaped = true;
      continue;
    }

    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      converted += ch;
      continue;
    }

    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      converted += ch;
      continue;
    }

    if (ch === "?" && !inSingle && !inDouble) {
      index += 1;
      converted += `$${index}`;
      continue;
    }

    converted += ch;
  }

  return converted;
}

function normalizeResult(result) {
  const meta = {
    affectedRows: result.rowCount,
    insertId: undefined,
    rowCount: result.rowCount,
  };

  if (/^\s*(SELECT|WITH|SHOW)\b/i.test(result.command || "")) {
    return [result.rows, undefined];
  }

  return [meta, undefined];
}

async function query(sql, params = []) {
  const result = await pgPool.query(normalizeSql(sql), params);
  return normalizeResult(result);
}

async function testConnection() {
  await pgPool.query("SELECT 1");
  console.log("PostgreSQL/Supabase connected successfully");
}

async function getConnection() {
  const client = await pgPool.connect();

  return {
    async beginTransaction() {
      await client.query("BEGIN");
    },
    async commit() {
      await client.query("COMMIT");
    },
    async rollback() {
      await client.query("ROLLBACK");
    },
    release() {
      client.release();
    },
    async query(sql, params = []) {
      const result = await client.query(normalizeSql(sql), params);
      return normalizeResult(result);
    },
  };
}

module.exports = {
  pool: {
    query,
    getConnection,
  },
  testConnection,
  normalizeSql,
};
