let isDark = true

$( document ).ready(() => {
  $('#toggleTheme').html('Light Mode')
})

$('#toggleTheme').on('click', () => {
  if (isDark) {
    $('body').removeClass('uk-section-secondary')
    $('body').addClass('uk-section-muted')
    $('#toggleTheme').html('Light Mode')
    isDark = false
  } else {
    $('body').removeClass('uk-section-muted')
    $('body').addClass('uk-section-secondary')
    $('#toggleTheme').html('Dark Mode')
    isDark = true
  }
})