$(document).ready(function() {
    $('#logoutUser').click((e) => {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/user/logout',
            success: function(data) {
                window.location.href = data.redirect;
            },
            error: function() {

                alert('Error while logout')

            }
        })
    })
})