// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Hide feedback zone
    $('#feedback').show();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    // Show modify user form
    $('#userList table tbody').on('click', 'td a.linkmodifyuser', showModifyForm);

    // Show modify user form
    $('#modifyUser').on('click', 'a#hideModify', hideModifyForm);

    // Modify User form button click
    $('#btnModifyUser').on('click', modifyUser);

    // Activite table filter plugin
    $("#tableUserList").stupidtable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '<td><a href="#" class="linkmodifyuser" rel="' + this._id + '">modify</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');
    console.log(thisUserName);

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

// Show modify user form
function showModifyForm(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#modifyUser #inputUserFullname').val(thisUserObject.fullname);
    $('#modifyUser #inputUserEmail').val(thisUserObject.email);
    $('#modifyUser #inputUserName').val(thisUserObject.username);
    $('#modifyUser #inputUserAge').val(thisUserObject.age);
    $('#modifyUser #inputUserGender').val(thisUserObject.gender);
    $('#modifyUser #inputUserLocation').val(thisUserObject.location);
    $('#modifyUser #btnModifyUser').attr('name', thisUserObject._id);

    $('#modifyUser').css('display','block');

};

// Hide modify user form
function hideModifyForm(event) {

    //Populate Info Box
    $('#modifyUser #inputUserFullname').val('');
    $('#modifyUser #inputUserEmail').val('');
    $('#modifyUser #inputUserName').val('');
    $('#modifyUser #inputUserAge').val('');
    $('#modifyUser #inputUserGender').val('');
    $('#modifyUser #inputUserLocation').val('');
    $('#modifyUser #btnModifyUser').attr('name', '');

    $('#modifyUser').css('display','none');

};

// Modify User
function modifyUser(event) {

    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#modifyUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

            // id of User to modify, in button name
            var idToModify = $(this).attr('name');

            // User to modify
            var userToModify = {
                    'username': $('#modifyUser #inputUserName').val(),
                    'email': $('#modifyUser #inputUserEmail').val(),
                    'fullname': $('#modifyUser #inputUserFullname').val(),
                    'age': $('#modifyUser #inputUserAge').val(),
                    'location': $('#modifyUser #inputUserLocation').val(),
                    'gender': $('#modifyUser #inputUserGender').val()
            }

                // If they did, do our delete
                $.ajax({
                    type: 'PUT',
                    data: userToModify,
                    dataType: 'JSON',
                    url: '/users/modifyuser/' + idToModify
                }).done(function( response ) {

                    // Check for a successful (blank) response
                    if (response.success === 1) {
                        $('#feedback p').text("Utilisateur mis à jour !");
                        $('#feedback p').removeClass();
                        $('#feedback p').addClass( "modifysuccess" );
                        $('#feedback').fadeIn().delay(5000).fadeOut();
                        hideModifyForm();
                    }
                    else {
                        //alert('Error: ' + response.msg);
                        var feedbackError = 'Erreur avec la base de données : ' + response.msg;
                        $('#feedback p').text(feedbackError);
                        $('#feedback p').removeClass();
                        $('#feedback p').addClass( "modifyerror" );
                        $('#feedback').fadeIn().delay(5000).fadeOut();
                    }

                    // Update the table
                    populateTable();                    

                });
    }

    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }

};
