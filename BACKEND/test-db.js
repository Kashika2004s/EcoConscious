const db = require("./db");

async function test() {
  try {
    const [rows] = await db.query("SELECT DATABASE()");
    console.log("Connected database:", rows);
  } catch (error) {
    console.error(error);
  }
}

test();