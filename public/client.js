$('#email').keyup(function () {
  const email = $('#email')
  if (email.val()) {
    if (!validateEmail(email.val())) {
      email.css({ 'color': '#f0506e', 'border-color': '#f0506e' })
    } else {
      email.css({ 'color': '#32d296', 'border-color': '#32d296' })
    }
  }
})

var validateEmail = function (emailValue) {
  var regex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
  return regex.test(emailValue)
}

$('#username').keyup(function () {
  const username = $('#username')
  if (username.val()) {
    // https://aashutoshrathi.glitch.me/api/gh/ to increase API calls without 403.
    const profile = 'https://aashutoshrathi.glitch.me/api/gh/' + username.val()
    fetch(profile)
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          username.css({ color: '#f0506e', 'border-color': '#f0506e' })
        } else {
          username.css({ color: '#32d296', 'border-color': '#32d296' })
        }
      })
      .catch(e => {
        console.log(e)
      })
  } else {
    username.css({ 'color': '#32d296', 'border-color': '#32d296' })
  }
})

window.getStatus = function (url) {
  const request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    if (request.readyState === 2) {
      return request.status
      // this contains the status code
    }
  }
  request.open('GET', url, true)
  request.send()
}

$.put = function (url, data, callback, type) {
  if ($.isFunction(data)) {
    type = type || callback
    callback = data
    data = {}
  }

  return $.ajax({
    url: url,
    type: 'PUT',
    success: callback,
    data: data,
    contentType: type
  })
}

$(function () {
  $('form').submit(function (event) {
    event.preventDefault()
    const username = $('#username').val()
    const email = $('#email').val()
    console.log(username)
    fetch(`/sendmail/${username}/${email}`)
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          // eslint-disable-next-line
          UIkit.notification({
            message: '<span class=\'uk-text-small\' uk-icon=\'icon: thumbs-up\'>A verification E-mail has been sent.</span>',
            status: 'success',
            pos: 'top-center',
            timeout: 2000
          })
        }
      })
      .catch((e) => {
        console.error(e)
        // eslint-disable-next-line
        UIkit.notification({
          message: '<span class=\'uk-text-small\' uk-icon=\'icon: warning\'>An error occured. Please try again later.</span>',
          status: 'danger',
          pos: 'top-center',
          timeout: 1000
        })
      })
  })
})

window.showToast = function () {
  const username = $('#username').val()
  const email = $('#email').val()
  if (username === '' && email === '') {
    // eslint-disable-next-line
    UIkit.notification({
      message: '<span uk-icon=\'icon: warning\'></span> <span class=\'uk-text-small\'>Email and Username are required fields</span>',
      status: 'danger',
      pos: 'top-center',
      timeout: 2000
    })
  } else if (email === '' || username === '') {
    var empty = 'Email'
    if (username.length === 0) {
      empty = 'Username'
    }
    // eslint-disable-next-line
    UIkit.notification({
      message: `<span uk-icon='icon: warning'></span> <span class='uk-text-small'>${empty} is required field.</span>`,
      status: 'danger',
      pos: 'top-center',
      timeout: 1500
    })
  } else {
    // eslint-disable-next-line
    UIkit.notification({
      message: '<div uk-spinner></div> <span class=\'uk-text-small\'>Processing your request.</span>',
      status: 'success',
      pos: 'bottom-center',
      timeout: 2000
    })
  }
}
