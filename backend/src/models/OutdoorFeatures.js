'use strict';
const {
  DataTypes
} = require('sequelize');

const Sequelize = require('../config/_db/mlbrokerage.db');

const OutdoorFeatures = Sequelize.define("outdoor_features", {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  features: {
      allowNull: false,
      type: DataTypes.ENUM("Badminton", "Balcony", "Basketball Court", "Carport", "Clubhouse", "Courtyard", "Fully Fenced", "Function Area", "Garage", "Garden", "Gazebos", "Jacuzzi", "Jogging path", "Lanai", "Landscape Garden",
        "Multi-purpose Lawn", "Open car spaces", "Parking Lot", "Parks", "Playground", "Remote Garage", "Secure Parking", "Shower Rooms", "Sports Facilities", "Swimming Pool", "Tennis Court"
      ),
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)')
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
  }
},{
  modelName: 'OutdoorFeatures',
  timestamps: false,
})

module.exports = OutdoorFeatures;