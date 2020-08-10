function alertMessage(message, status) {
    $('.section').append(`
    <div class='alertMessage work_alert other_alert'>
        <div class='alert'>
            <div class='alert-content'>
                <div class='alert-icon'></div>
                <div class='alert-message'>${message}</div>
            </div>
            <div class='alert-dismiss'></div>
        </div>
    </div>`)

    // start alert
    let delay = 0;
    setTimeout(function () {
        $('.alert').addClass(`alert-active alert-${status}`);
    }, delay);

    // auto close alert
    setTimeout(function () {
        $('.alert').removeClass("alert-active");
        $('.alert').addClass("alert-closing");

        // remove element from DOM
        setTimeout(function () {
            $('.alert').remove();
        }, 500);
    }, 2000 + delay);

    // remove by clicking
    $('.alert-dismiss').on('click', function dismissAlert(e) {
        if ($(e.target).parent(".alert")) {
            $(this).parent('.alert').removeClass("alert-active");
            $(this).parent('.alert').addClass("alert-closing");
            setTimeout(function () {
                $('.alert').remove();
            }, 500);
        }
    })

}
