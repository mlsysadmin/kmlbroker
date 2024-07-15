'use strict';
const {
  DataTypes
} = require('sequelize');

const Sequelize = require('../config/_db/mlbrokerage.db');

const PropertyViews = Sequelize.define("property_views", {
  view_id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER.UNSIGNED
  },
  user_id: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
    references: {
      model: {
        model: "User",
        tableName: 'users',
      },
      key: 'user_id',
    },
  },
  master_property_id: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
    references: {
      model: {
        model: "MasterPropertyList",
        tableName: 'master_property_lists',
      },
      key: 'master_property_id',
    },
  },
  viewed_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  modelName: 'PropertyViews',
  timestamps: false,
})

module.exports = PropertyViews;