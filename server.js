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
const sgMail = require('@sendgrid/mail')
const { glitch, slack, webhookURL, token } = require('./constants')

app.use(bodyParser.json())
sgMail.setApiKey(process.env.SG_TOKEN)

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

// Send the mail to the given email
app.get('/sendmail/:username/:id', (req, res, next) => {
  const username = req.params.username
  const id = req.params.id
  const base64 = urlcrypt.cryptObj({
    email: id,
    username: username
  })

  // Invite to Slack
  const slackUrl = `https://slack.com/api/users.admin.invite?token=${slack}&email=${id}`
  axios.post(slackUrl)

  // Post invitation message on Slack
  const time = Math.round(new Date().getTime() / 1000)
  const message = `${username} got invited to iiitv organization on GitHub and Slack`
  const options = {
    text: 'Welcome to IIITV',
    attachments: [
      {
        color: '#36a64f',
        title: 'Invitation from IIITV',
        title_link: 'https://github.com/orgs/iiitv/people',
        text: message,
        footer: 'Slack API',
        ts: time
      }
    ]
  }

  const sendMessage = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(webhookURL, JSON.stringify(options))
        .then(response => {
          return resolve('SUCCESS: Sent slack webhook', response.data)
        })
        .catch(error => {
          return reject(new Error('FAILED: Sent slack webhook', error))
        })
    })
  }

  const loop = async () => {
    for (let i = 0; i < 3; i++) {
      console.log('retrying sending message ', i)
      try {
        const res = await sendMessage()
        console.log(res)
        break
      } catch (err) {
        console.log(err)
      }
    }
  }

  loop()

  const verificationurl = `https://${req.get('host')}/verify/${base64}`

  const msg = {
    to: id,
    from: 'IIITV Coding Club <ossteam@iiitv.ac.in>',
    subject: 'Invitation to join IIITV OSS Team',
    html: createMail.createMail(username, verificationurl)
  }

  sgMail.send(msg)
})

// Verify the email id through the link, and add as member
app.get('/verify/:base64', (request, response, next) => {
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
  const promise = new Promise((resolve, reject) => {
    let pref = `batch-of-${parseInt(data.email.substring(0, 4)) - 4}`
    const checkInsti = data.email.split('@')[1]
    if (checkInsti === 'iiitv.ac.in' || checkInsti === 'iiitvadodara.ac.in') {
      console.log('IIITian')
      const removeURL = `https://api.github.com/teams/outsiders/memberships/${data.username}?access_token=${token}`
      axios
        .delete(removeURL)
        .then(res => {
          console.log(res.data.url)
          resolve(204)
        })
        .catch(error => {
          reject(error)
        })
    } else {
      pref = 'outsiders'
    }
    console.log(pref)
    const url = `https://api.github.com/teams/${pref}/memberships/${data.username}?access_token=${token}`
    console.log(url)

    axios
      .put(url)
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

const listener = app.listen(3000 || process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
