/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('events', {
    id: 'id', // shorthand for serial primary key
    title: { type: 'varchar(1000)', notNull: true },
    start: { type: 'timestamp with time zone', notNull: true },
    end: { type: 'timestamp with time zone', notNull: true },
  });

  pgm.createTable('users', {
    id: { type: 'varchar(255)', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true },
    emailVerified: { type: 'boolean', notNull: true, default: false },
    image: { type: 'text' },
    createdAt: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
    updatedAt: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createTable('sessions', {
    id: { type: 'varchar(255)', primaryKey: true },
    userId: { type: 'varchar(255)', notNull: true, references: '"users"' },
    token: { type: 'varchar(255)', notNull: true, unique: true },
    expiresAt: { type: 'timestamp with time zone', notNull: true },
    createdAt: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
    updatedAt: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createTable('mcp_configs', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(255)', notNull: true },
    url: { type: 'text', notNull: true },
    apiKey: { type: 'text' },
    createdAt: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
    updatedAt: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createTable('app_configs', {
    key: { type: 'varchar(255)', primaryKey: true },
    value: { type: 'text', notNull: true },
    updatedAt: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('app_configs');
  pgm.dropTable('mcp_configs');
  pgm.dropTable('sessions');
  pgm.dropTable('users');
  pgm.dropTable('events');
};
