/*
 * app.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */

import express from 'express'
import jwt from 'jsonwebtoken'

const app = express()

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  })
})

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret key', (err, authData) => {
    if (err) {
      res.sendStatus(403)
    } else {
      res.json({
        message: 'Post created...',
        authData
      })
    }
  })
})

app.post('/api/login', (req, res) => {
  // Mock user
  const user = {
    id: '1',
    username: 'Yan',
    email: 'yan@yan.com',
  }

  jwt.sign({ user }, 'secret key', { expiresIn: '30s' }, (err, token) => {
    res.json({ token })
  })
})

// FORMAT OF THE TOKEN
// Authorization: Bearer <access_token>

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization']
  console.log(req.headers)
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // split at the space
    const bearer = bearerHeader.split(' ')
    // Get token from the array
    const bearerToken = bearer[1]
    // Set the Token
    req.token = bearerToken
    // Next middleware
    next()
  } else {
    // Forbidden
    res.sendStatus(403)
  }
}

app.listen(5000, () => {
  console.log('Server started on port 5000!')
})
