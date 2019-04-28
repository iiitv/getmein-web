$('#toggleTheme').on('change', () => {
  if ($('#toggleTheme').is(':checked')) {
    $('body').removeClass('uk-section-secondary');
    $('body').addClass('uk-section-defaultd');
  } else {
    $('body').removeClass('uk-section-defaultd');
    $('body').addClass('uk-section-secondary');
  }
});
