import knex from 'knex';
import path from 'path';

export const db = knex({
  client: 'postgres',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite')
  },
  useNullAsDefault: true,
});
