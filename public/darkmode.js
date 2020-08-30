$('#toggleTheme').on('change', () => {
  if ($('#toggleTheme').is(':checked')) {
    $('body').removeClass('uk-section-secondary')
    $('body').addClass('uk-section-default')
  } else {
    $('body').removeClass('uk-section-default')
    $('body').addClass('uk-section-secondary')
  }
})
