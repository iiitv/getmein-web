$('#toggleTheme').on('change', () => {
    if ($('#toggleTheme').is(":checked")) {
        $('body').removeClass('uk-section-secondary')
        $('body').addClass('uk-section-defaultd')
        console.log('>>> [darkmode.js:6] light ')
    } else {
        $('body').removeClass('uk-section-defaultd')
        $('body').addClass('uk-section-secondary')
        console.log('>>> [darkmode.js:10] dark ')
    }
});
