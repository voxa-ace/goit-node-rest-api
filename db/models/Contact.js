import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";
import User from "./User.js";

const Contact = sequelize.define("Contact", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", 
      key: "id",
    },
    onDelete: "CASCADE",
  },
}, {
  timestamps: true,
});

export default Contact;
