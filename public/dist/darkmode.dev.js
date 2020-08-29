"use strict";

$('#toggleTheme').on('change', function () {
  if ($('#toggleTheme').is(':checked')) {
    $('body').removeClass('uk-section-secondary');
    $('body').addClass('uk-section-default');
  } else {
    $('body').removeClass('uk-section-default');
    $('body').addClass('uk-section-secondary');
  }
}); // const toggleTheme = document.getElementById("toggleTheme")
// const input = document.getElementById('email')
// toggleTheme.addEventListener('click',()=>{
//   if(toggleTheme.checked){
//     input.style.backgroundColor = "white"
//   }else{
//     input.style.background = "black"
//   }
// })