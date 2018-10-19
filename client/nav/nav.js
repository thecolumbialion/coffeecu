Template.nav.rendered = function () {
  // For hamburger button when navbar is too narrow
  $(".button-collapse").sideNav();

  // To activate links
  $('.menu .item').state();
};

Template.nav.events({
  'click .brand-logo': function() {
    console.log("logo clicked");
    var searchtext = document.querySelector(".searchbar .searchbox input");
    searchtext.value = "";

    PeopleIndex.getComponentMethods().search("");
  }
});

Template.logout.events({
  'click .logout': function () {
    AccountsTemplates.logout();
    Router.go("/");
  }
});

Template.userprofile.helpers({
  'id': function () {
    return Meteor.userId();
  }
});

// Verify email
Meteor.startup(function(){
  if (Accounts._verifyEmailToken) {
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(error) {
      Accounts._enableAutoLogin();
      Router.go('/user/' + Meteor.userId());
    });
  }
});
