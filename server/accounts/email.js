Accounts.validateNewUser( function (user) {
  var email;
  if (user.emails){
    if(Meteor.users.findOne({'services.google.email': user.emails[0].address}))
      throw new Meteor.Error(409, "You signed up via OAuth. Log in using the 'Sign in with Google' button.");


    email = user.emails[0].address.toLowerCase();
  }
  else{
    if(Meteor.users.findOne({'emails.0.address': user.services.google.email}))
      throw new Meteor.Error(409, "You signed up with a password. Log in or reset your password.");

    email = user.services.google.email;
  }

  if (/[a-z]{2,3}\d*@(tc.|gsb.|law.)*(barnard|columbia)\.edu$/.test(email))  {
    return true;
  } else {
    throw new Meteor.Error(403, "Use a <UNI>@columbia.edu or <UNI>@barnard.edu email address.");
  }
});

// Make email from services accessible
Meteor.publish("user-data", function () {
    return Meteor.users.find({_id: this.userId}, {fields: {'services.google.email': 1}});
});

Accounts.emailTemplates.siteName = "Coffee@CU";

Accounts.emailTemplates.from = "Coffee@CU <do-not-reply@coffeecu.com>";

// Acconut verification
Accounts.emailTemplates.verifyEmail.subject = function(user) {
  return 'Coffee@CU- Email Verification';
};

Accounts.emailTemplates.verifyEmail.text = function(user, url) {
  return 'Hi!\nThank you for registering for Coffee@CU. Please click the following link to verify your email address: \n\n' + url;
};

// Reset password
Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Coffee@CU - Password Reset";
};

Accounts.emailTemplates.resetPassword.text = function (user, url) {
    var signature = "Coffee@CU bot";

    return "Hi!\n It looks like you forgot your password. \nClick the following link to reset your password:\n" +
        url + "\n\n" +
        "Cheers,\n" +
        "The Coffee@CU Team";
};
