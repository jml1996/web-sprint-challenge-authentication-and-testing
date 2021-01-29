const db = require("../../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function find() {
  return db("users").select("id", "username").orderBy("id");
}

async function findBy(username) {
    return db("users")
        .select("id", "username", "password")
        .where("username", username);
}

async function add(user) {
    const userExists = await db("users")
        .select("id", "username", "password")
        .where("username", user.username);
    if (userExists.length > 0) {
        return { message: "username taken" }
    } else {
        const [id] = await db("users").insert(user, "id");
        return findById(id);
    }
}

function findById(id) {
  return db("users").where({ id }).first();
}
