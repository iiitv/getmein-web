// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html



$("#username").keyup(function(){
  let userfield = $("#username");
  let profile = "https://api.github.com/users/" + userfield.val();

  fetch(profile)
  .then((response) => {
    response.json()
    .then((data) => {
      if ( data.message ) {
        userfield.css({"color":"#f0506e", "border-color": "#f0506e"});
        UIkit.tooltip("#username-cont").show();
      } else {
        userfield.css({"color":"#32d296", "border-color": "#32d296"});
        UIkit.tooltip("#username-cont").hide();
      }
    });
  })
  .catch((e)=>{
    console.log(e);
  });
});

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

$(function() {
  $('form').submit(function(event) {
    event.preventDefault()
    var username = $('#username').val()  
    var email = $('#email').val()
    console.log(username);
    fetch(`/sendmail/${username}/${email}`)
    .then((res) => {
      console.log(res);
      if (res.status == 200) {
        UIkit.notification({
          message: '<span uk-icon=\'icon: thumbs-up\'></span> A verification E-mail has been sent.',
          status: 'success',
          pos: 'top-center',
          timeout: 2000
        });
      }
    })
    .catch((e) => {
      UIkit.notification({
        message: '<span uk-icon=\'icon: warning\'></span> An error occured. Please try again later.',
        status: 'danger',
        pos: 'top-center',
        timeout: 1000
      });
    });
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