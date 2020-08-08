$(document).ready(function() {
    $('#register-submit').click((e) => {
        e.preventDefault()
        var $firstName = $('#exampleInputFirstname1')
        var $lastName = $('#exampleInputLastname1')
        var $email = $('#exampleInputEmail1')
        var $password = $('#exampleInputPassword1')

        var data = {
            firstName: $firstName.val(),
            lastName: $lastName.val(),
            email: $email.val(),
            password: $password.val()
        }
        $.ajax({
            type: 'POST',
            url: '/register',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            dataType: "json",
            success: function(data) {
                window.location.href = data.redirect
            },
            error: function() {
                alert('Email already taken')
            }
        })

    })

    $('#login-submit').click((e) => {
        e.preventDefault()
        var $email = $('#login-email')
        var $password = $('#login-password')

        var data = {
            email: $email.val(),
            password: $password.val()
        }
        $.ajax({
            type: 'POST',
            url: '/login',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            dataType: "json",
            success: function(data) {
                window.location.href = data.redirect;
            },
            error: function() {
                alert('incorrect email or password')
            }
        })

    })


})