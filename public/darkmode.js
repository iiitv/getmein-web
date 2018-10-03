$('#toggleTheme').on('change', () => {
  if ($('#toggleTheme').is(":checked")) {
    $('body').removeClass('uk-section-secondary')
    $('body').addClass('uk-section-muted')
    console.log('>>> [darkmode.js:6] light ')
  } else {
    $('body').removeClass('uk-section-muted')
    $('body').addClass('uk-section-secondary')
    console.log('>>> [darkmode.js:10] dark ')
  }
})