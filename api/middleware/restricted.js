const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../../config/secret.js")

module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json('token invalid')
      } else {
        req.decodedJwt = decoded
        next()
      }
    })
  } else {
    res.status(401).json('token required')
  }
};
// code grade tests passing here but 2 are failing on code grade