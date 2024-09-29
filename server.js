require('dotenv').config()
const express = require('express')
const app = express()
const axios = require('axios')
const path = require('path')
const crypto = require('crypto')
const { execSync } = require('child_process')
const bodyParser = require('body-parser')
const createMail = require('./createmail')
const urlcrypt = require('url-crypt')(
  '~{ry*I)44==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF'
)
const nodemailer = require('nodemailer')
const {
  glitch,
  token,
  selfEmail,
  githubApi
} = require('./constants')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: selfEmail,
    pass: process.env.GMAIL_KEY
  }
})

app.use(bodyParser.json())

// Auto-update Glitch with GitHub
app.post('/git', (req, res) => {
  const hmac = crypto.createHmac('sha1', glitch)
  const sig = `sha1=${hmac.update(JSON.stringify(req.body)).digest('hex')}`
  if (
    req.headers['x-github-event'] === 'push' &&
    crypto.timingSafeEqual(
      Buffer.from(sig),
      Buffer.from(req.headers['x-hub-signature'])
    )
  ) {
    res.sendStatus(200)
    const commands = [
      'git fetch origin master',
      'git reset --hard origin/master',
      'git pull origin master --force',
      'npm i',
      'refresh'
    ]
    for (const cmd of commands) {
      try {
        const o = execSync(cmd)
        console.log(o.toString())
      } catch (e) {
        console.log(e)
      }
    }
    console.log('> [GIT] Updated with origin/master')
  } else {
    console.log('webhook signature incorrect!')
    return res.sendStatus(403)
  }
})

app.use(express.static('public'))

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

// Send the mail to the given email
app.get('/sendmail/:username/:id', (req, res) => {
  const { username, id } = req.params

  const base64 = urlcrypt.cryptObj({
    email: id,
    username: username
  })

  const verificationurl = `https://${req.get('host')}/verify/${base64}`

  const mailOptions = {
    from: selfEmail,
    to: id,
    subject: 'Invitation to join IIITV OSS Team',
    html: createMail.createMail(username, verificationurl)
  }

  transporter.sendMail(mailOptions)
    .then((info) => {
      console.log('Email Sent: ' + info.response)
      res.status(200).send('Email sent')
    })
    .catch((err) => {
      console.error(err)
      res.status(400).send('Error occured. Please try again later.')
    })
})

app.get('/users/:username', (req, res) => {
  const { username } = req.params
  const url = `${githubApi}/users/${username}`
  axios.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      res.json(response.data)
    })
    .catch(error => {
      console.log(error)
      res.status(404).send({ error: 'User not found' })
    })
})

// Verify the email id through the link, and add as member
app.get('/verify/:base64', (request, response) => {
  const encryptedData = request.params.base64
  try {
    const data = urlcrypt.decryptObj(encryptedData)
    addMember(data)
      .then(status => {
        response.status(status)
        response.redirect('https://github.com/orgs/iiitv/teams')
      })
      .catch(err => {
        console.log(err)
        response.status(400).send('Error occured. Please try again later.')
        response.end()
      })
  } catch (e) {
    response.status(400).send('Invalid Link.')
  }
})

// Add the member as per their email id
const addMember = data => {
  const { email, username } = data
  const regex = /^20\d{7}@iiitv(adodara)?.ac.in$/; // eslint-disable-line
  const promise = new Promise((resolve, reject) => {
    const pref = regex.test(email) ? `batch-of-${parseInt(email.substring(0, 4)) + 4}` : 'outsiders'
    const url = `${githubApi}/orgs/iiitv/teams/${pref}/memberships/${username}`
    const headers = {
      Authorization: `token ${token}`
    }
    axios
      .put(url, {}, { headers })
      .then(res => {
        console.log(res.data.url)
        resolve(200)
      })
      .catch(error => {
        reject(error)
      })
  })
  return promise
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
