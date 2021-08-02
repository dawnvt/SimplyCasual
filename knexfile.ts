import config from "./src/config.json";

module.exports = {

  development: {
    client: "postgresql",
    connection: config.db,
    version: "13",
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "migrations"
    }
  },

  staging: {
    client: "postgresql",
    connection: config.db,
    version: "13",
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: config.db,
    version: "13",
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "migrations"
    }
  }

};
