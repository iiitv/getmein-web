// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html



function ghAccountExists(username) {
  let profile = "https://api.github.com/users/" + username;
  if(getStatus(profile) == 200) {
    return true;
  }
  return false;
}

function getStatus(url) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
          if (request.readyState === 2){
              return request.status;
              //this contains the status code
          }
      };
      request.open("GET", url, true);
      request.send(); 
}

$.put = function(url, data, callback, type){
 
  if ( $.isFunction(data) ){
    type = type || callback,
    callback = data,
    data = {}
  }
 
  return $.ajax({
    url: url,
    type: 'PUT',
    success: callback,
    data: data,
    contentType: type
  });
}

$("#username").keyup(function(){
    let exists = ghAccountExists($("#username").val())
    if(exists) {
      console.log(exists)
    }
    else {
      console.log(exists)
    }
});

$(function() {
  $('form').submit(function(event) {
    event.preventDefault()
    var username = $('#username').val()  
    var email = $('#email').val()
    console.log(username);
    $.get('/add?' + $.param({username: username, email: email}), function() {
      $('input').val('')
      $('input').focus()
      window.location.reload();
    })
  })

})

function showToast() {
  var username = $('#username').val()
  var email = $('#email').val()
  if(username === "" && email === "") {
    UIkit.notification({
      message: '<span uk-icon=\'icon: warning\'></span> email and github username are required fields.',
      status: 'danger',
      pos: 'top-center',
      timeout: 1000
    });
  } else if(email === "") {
    UIkit.notification({
      message: '<span uk-icon=\'icon: warning\'></span> email is a required field.',
      status: 'danger',
      pos: 'top-center',
      timeout: 1000
    });
  } else if(username === "") {
    UIkit.notification({
      message: '<span uk-icon=\'icon: warning\'></span> username is a required field.',
      status: 'danger',
      pos: 'top-center',
      timeout: 1000
    });
  } else {
    UIkit.notification({
      message: '<div uk-spinner></div> Processing your request.',
      status: 'success',
      pos: 'bottom-center',
      timeout: 2000
    })
  }
}