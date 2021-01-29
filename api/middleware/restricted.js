const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../../config/secret.js")

module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json('invalid token')
      } else {
        req.decodedJwt = decoded
        next()
      }
    })
  } else {
    res.status(401).json('invalid credentials')
  }
};