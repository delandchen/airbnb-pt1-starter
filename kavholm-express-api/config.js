require("dotenv").config()
require("colors")

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
const SECRET_KEY = process.env.SECRET_KEY || "secret_dev"

const IS_TESTING = process.env.NODE_ENV === "test"

function getDatabaseUri() {
  const dbUser = process.env.DATABASE_USER || "postgres"
  const dbPass = process.env.DATABASE_PASS ? encodeURI(process.env.DATABASE_PASS) : "rams1359"
  const dbHost = process.env.DATABASE_HOST || "localhost"
  const dbPort = process.env.DATABASE_PORT || 5432
  const dbTestName = process.env.DATABASE_TEST_NAME || "kavholm_test"
  const dbProdName = process.env.DATABASE_NAME || "kavholm"
  const dbName = process.env.NODE_ENV === "test" ? dbTestName : dbProdName

  return process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
}

const BCRYPT_WORK_FACTOR = IS_TESTING ? 1 : 13

console.log("Kavholm Config:".red)
console.log("PORT:".blue, PORT)
console.log("SECRET_KEY:".blue, SECRET_KEY)
console.log("IS_TESTING:".blue, IS_TESTING)
console.log("BCRYPT_WORK_FACTOR".blue, BCRYPT_WORK_FACTOR)
console.log("Database:".blue, getDatabaseUri())
console.log("---")

module.exports = {
  PORT,
  SECRET_KEY,
  IS_TESTING,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
}
