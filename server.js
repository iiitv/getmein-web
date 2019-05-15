const express = require('express')
const app = express()
const axios = require('axios')
const path = require('path')
const nodemailer = require('nodemailer')
const createMail = require('./createmail')
const urlcrypt = require('url-crypt')('~{ry*I)44==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF')
const mail = process.env.EMAIL
const password = process.env.PASSWORD
const token = process.env.SECRET
const b13 = process.env.B13
const b14 = process.env.B14
const b15 = process.env.B15
const b16 = process.env.B16
const b17 = process.env.B17
const b18 = process.env.B18
const outs = process.env.OUTS
const slack = process.env.SLACK_TOKEN

// Get transporter services
const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com'
const emailSecure = process.env.EMAIL_SECURE || true
const emailPort = process.env.PORT || 465
const emailPool = process.env.POOL || true

app.use(express.static('public'))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/views/index.html'))
})

const dict = {}
dict['2013'] = b13
dict['2014'] = b14
dict['2015'] = b15
dict['2016'] = b16
dict['2017'] = b17
dict['2018'] = b18
dict['outsider'] = outs

// Send the mail to the given email
app.get('/sendmail/:username/:id', (request, response, next) => {
  const username = request.params.username
  const id = request.params.id
  const base64 = urlcrypt.cryptObj({
    email: id,
    username: username
  })

  // Invite to Slack
  var SlackURL = `https://slack.com/api/users.admin.invite?token=${slack}&email=${id}`
  axios.post(SlackURL)

  const verificationurl = `https://${request.get('host')}/verify/${base64}`

  var transporter = nodemailer.createTransport({
    host: emailHost,
    secure: emailSecure,
    port: emailPort,
    pool: emailPool,
    auth: {
      user: mail,
      pass: password
    }
  })

  const mailOptions = {
    from: '"IIITV Coding Club" <codingclub@iiitv.ac.in>',
    to: id,
    cc: mail,
    subject: 'Invitation to join IIITV Organization on GitHub',
    html: createMail.createMail(username, verificationurl)
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      response.send({ status: 500 })
      response.end()
    } else {
      response.send({ status: 200 })
      response.end()
    }
  })
})

// Verify the email id through the link, and add as member
app.get('/verify/:base64', (request, response, next) => {
  const encryptedData = request.params.base64
  try {
    const data = urlcrypt.decryptObj(encryptedData)
    addMember(data)
      .then((status) => {
        response.status(status)
        response.redirect('https://github.com/orgs/iiitv/teams')
      })
      .catch((err) => {
        console.log(err)
        response.status(400).send('Error occured. Please try again later.')
        response.end()
      })
  } catch (e) {
    response.status(400).send('Invalid Link.')
  }
})

// Add the member as per their email id
const addMember = (data) => {
  const promise = new Promise((resolve, reject) => {
    let pref = data.email.substring(0, 4)
    const checkInsti = data.email.split('@')[1]
    if (checkInsti === 'iiitv.ac.in' || checkInsti === 'iiitvadodara.ac.in') {
      console.log('IIITian')
      const removeURL = `https://api.github.com/teams/${dict['outsider']}/memberships/${data.username}?access_token=${token}`
      axios.delete(removeURL)
        .then(response => {
          console.log(response.data.url)
          resolve(204)
        })
        .catch(error => {
          reject(error)
        })
    } else {
      pref = 'outsider'
    }
    console.log(pref)
    const url = `https://api.github.com/teams/${dict[pref]}/memberships/${data.username}?access_token=${token}`
    console.log(url)

    axios.put(url)
      .then(response => {
        console.log(response.data.url)
        resolve(200)
      })
      .catch(error => {
        reject(error)
      })
  })

  return promise
}

// listen for requests :)
const listener = app.listen(3000 || process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
