'use strict';
const Sequelize = require('../config/_db/mlbrokerage.db');
const { Hash } = require('../utils/_helper/hash.helper');
const { DataTypes } = require('sequelize');
const Role = require('./Role');

function notNullIfUserIsSeller(instance) {
  if (instance.role_id === 2 && (instance.license === null || instance.license === undefined)) {
    throw new Error('license cannot be null if user_role is seller');
  }
}

const HashPass = async(pass) => {
  try {
    return await Hash(pass);
  } catch (error) {
    return error
  }
}

const User = Sequelize.define("users", {
  user_id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  ckyc_id: {
      allowNull: false,
      type: DataTypes.STRING(25)
  },
  mobile_number: {
      allowNull: false,
      type: DataTypes.STRING(15),
  },
  first_name: {
      allowNull: false,
      type: DataTypes.STRING(60)
  },
  middle_name: {
      allowNull: true,
      type: DataTypes.STRING(60)
  },
  last_name: {
      allowNull: false,
      type: DataTypes.STRING(60)
  },
  suffix: {
      allowNull: true,
      type: DataTypes.STRING(5)
  },
  birth_date: {
      allowNull:false,
      type: DataTypes.DATEONLY
  },
  email: {
      allowNull: false,
      type: DataTypes.STRING(100)
  },
  password: {
      allowNull: false,
      type: DataTypes.STRING(100),
      async set(pass){
        this.setDataValue('password', await HashPass(pass))
      }
  },
  user_desc: {
      allowNull: false,
      type: DataTypes.ENUM("I'm a licensed real estate broker", "I'm a real estate agent", "I'm looking for my nexthome Buy/Rent", "I'm looking to Sell/Rent")
  },
  role_id: {
      allowNull: false,
      type: DataTypes.INTEGER
  },
  license: {
    allowNull: true,
    validate: {
        notNullIfUserIsSeller(value) {
            notNullIfUserIsSeller(this)
        }
    },
    type: DataTypes.BLOB
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
},{
  modelName: 'User',
  timestamps: false,
}
)

// class User extends model {
//   /**
//    * Helper method for defining associations.
//    * This method is not a part of Sequelize lifecycle.
//    * The `models/index` file will call this method automatically.
//    */
//   static associate(models) {
//     // define association here
//     this.hasOne(models.Role, { foreignKey: "role_id" })
//   }
// }

// User.init({
//   user_id: {
//     allowNull: false,
//     primaryKey: true,
//     type: DataTypes.INTEGER
//   },
//   ckyc_id: {
//       allowNull: false,
//       type: DataTypes.STRING(25)
//   },
//   mobile_number: {
//       allowNull: false,
//       type: DataTypes.STRING(15),
//   },
//   first_name: {
//       allowNull: false,
//       type: DataTypes.STRING(60)
//   },
//   middle_name: {
//       allowNull: true,
//       type: DataTypes.STRING(60)
//   },
//   last_name: {
//       allowNull: false,
//       type: DataTypes.STRING(60)
//   },
//   suffix: {
//       allowNull: false,
//       type: DataTypes.STRING(5)
//   },
//   birth_date: {
//       allowNull:false,
//       type: DataTypes.DATEONLY
//   },
//   email: {
//       allowNull: false,
//       type: DataTypes.STRING(100)
//   },
//   password: {
//       allowNull: false,
//       type: DataTypes.STRING(100),
//       set(pass){
//         this.setDataValue('password', HashPass(pass))
//       }
//   },
//   user_desc: {
//       allowNull: false,
//       type: DataTypes.STRING(255)
//   },
//   role_id: {
//       allowNull: false,
//       type: DataTypes.INTEGER
//   },
//   license: {
//     allowNull: true,
//     validate: {
//         notNullIfUserIsSeller(value) {
//             notNullIfUserIsSeller(this)
//         }
//     },
//     type: DataTypes.BLOB
//   }
// }, {
//   sequelize: Sequelize,
//   modelName: 'User',
//   tableName: "users"
// });

module.exports = User