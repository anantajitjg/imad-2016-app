//get admin details
function getAdminDetails() {
    $.getJSON(rootURL + "/get-user-details").done(function (data) {
        displayUser(data);
    });
}
$(function () {
    getAdminDetails();
    //home button for admin
    var home_trigger = $("#home_trigger");
    if (home_trigger.length > 0) {
        home_trigger.click(function () {
            window.location = "/admin";
        });
    }
    //initialize tiny mce
    if (typeof (tinymce) !== 'undefined') {
        tinymce.init({
            selector: 'textarea',
            height: 500,
            contextmenu: false,
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons paste textcolor colorpicker textpattern imagetools codesample toc'
            ],
            toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
            browser_spellcheck: true
        });
    }
    //add page
    var add_page_form = $("#add_page_form");
    if (add_page_form.length > 0) {
        var add_page_submit = $("#add_page_submit");
        var add_page_message = $(".user_message");
        add_page_form.submit(function (e) {
            e.preventDefault();
            add_page_submit.val("Please wait....");
            var articleTitle = $("#page_title").val();
            var articleType = $("input[name=type]:checked").val();
            var article = tinyMCE.activeEditor.getContent();
            var dataObj = {title: articleTitle, type: articleType, content: article};
            data = JSON.stringify(dataObj);
            $.ajax({
                method: "POST",
                url: rootURL + "/add-page",
                data: data,
                contentType: "application/json"
            }).done(function (res) {
                add_page_message.css("visibility", "visible").html("<div class='alert-success'>Successfully added!</div>");
                $("#add_page_form")[0].reset();
            }).fail(function () {
                add_page_message.css("visibility", "visible").html("<div class='alert-error'>Fail to add page!</div>");
            }).always(function () {
                add_page_submit.val("Add Article");
            });
        });
    }
    //edit page
    var edit_page_title = $("#edit_page_title");
    if (edit_page_title.length > 0) {
        $.getJSON(rootURL + "/get-articles").done(function (data) {
            var list = "<option value=''>--choose--</option>";
            for (var i = 0; i < data.length; i++) {
                list += "<option value='" + data[i].article_name + "'>" + data[i].title + "</option>";
            }
            edit_page_title.html(list);
        });
        edit_page_title.change(function () {
            var article = this.value;
            $.getJSON(rootURL + "/get-article", {articleName: article}).done(function (data) {
                tinyMCE.activeEditor.setContent(data[0].content);
                $("#edit_page_id").val(data[0].id);
            });
        });
        var edit_page_form = $("#edit_page_form");
        var edit_page_submit = $("#edit_page_submit");
        var edit_page_message = $(".user_message");
        edit_page_form.submit(function (e) {
            e.preventDefault();
            edit_page_submit.val("Please wait....");
            var article = tinyMCE.activeEditor.getContent();
            var articleID = $("#edit_page_id").val();
            var dataObj = {id: articleID, content: article};
            data = JSON.stringify(dataObj);
            $.ajax({
                method: "POST",
                url: rootURL + "/update-page",
                data: data,
                contentType: "application/json"
            }).done(function (res) {
                edit_page_message.css("visibility", "visible").html("<div class='alert-success'>Successfully Updated!</div>");
            }).fail(function () {
                edit_page_message.css("visibility", "visible").html("<div class='alert-error'>Fail to add page!</div>");
            }).always(function () {
                edit_page_submit.val("Update");
            });
        });
    }
});