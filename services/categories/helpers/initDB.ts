import sequelize from "../config/sequelize";

const initDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      break;
    } catch (error) {
      retries -= 1;
      console.log("Unable to connect to the database:", error);
      console.log("retries left:", retries);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

export default initDB;
