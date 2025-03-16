import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription: {
    type: DataTypes.ENUM,
    values: ["starter", "pro", "business"],
    defaultValue: "starter",
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  avatarURL: {
    type: DataTypes.STRING,
  },

  
  verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  verificationToken: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default User;
