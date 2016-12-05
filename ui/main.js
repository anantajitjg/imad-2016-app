var rootURL = window.location.protocol + "//" + window.location.host;//http://anantajitjg.imad.hasura-app.io
console.log(rootURL);
//display logged in username
function displayUser(userData) {
    var user_area = $("#user_area");
    if (user_area.length > 0) {
        var username = escapeHtml(userData.username);
        if ($(window).width() < 430 && username.length >= 12) {
            username = username.substring(0, 9) + "...";
        }
        user_area.html("<strong><img src='/img/user_logo/" + userData.user_logo + "' alt='user_logo' /> " + username + "</strong>&nbsp;&nbsp;<button id='logout_btn' onclick=\"window.location='/logout';\" class='btn_primary responsive_btn'><span class='glyphicon glyphicon-log-out' aria-hidden='true'></span><span class='responsive_text'>Logout</span></button>");
    }
}
//functions for managing cookies
function setCookie(n, v, t) {
    var d = new Date();
    d.setTime(d.getTime() + (t * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = n + "=" + v + ";" + expires + ";path=/";
}
function getCookie(n) {
    var name = n + "=";
    var arr = document.cookie.split(';');
    for (var i = 0; i < arr.length; i++) {
        var c = arr[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//escape html
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};
function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
        return entityMap[s];
    });
}
$(function () {
    //serialize object
    $.fn.serializeObject = function () {
        var obj = {};
        $.each(this.serializeArray(), function (i, o) {
            var n = o.name,
                    v = o.value;
            obj[n] = obj[n] === undefined ? v
                    : $.isArray(obj[n]) ? obj[n].concat(v)
                    : [obj[n], v];
        });
        return obj;
    };
});
