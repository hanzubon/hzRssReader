'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const table = 'item'
const old_col = 'item_id'
const new_col = 'guid'

exports.up = function(db) {
    return db.renameColumn(table, old_col, new_col)
};

exports.down = function(db) {
    return db.renameColumn(table, new_col, old_col)
};

exports._meta = {
  "version": 1
};
