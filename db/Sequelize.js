import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT || "postgres",
    port: process.env.DATABASE_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful.");

    await sequelize.sync({ alter: true }); 
    console.log("Database synchronized.");

  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

await connectDB();

export default sequelize;
