Router.configure({
  layoutTemplate: 'ApplicationLayout',
  notFoundTemplate: '404'
});

Router.route('/', function () {
  this.render('Home');
});

Router.route('/browse', function () {
  this.render('Browse');
});


Router.route('/user/:userid', function () {
  if (this.params.userid == Meteor.userId()){
    this.render('User');
  }
  else {
    this.render('404');
  }
});

Router.route('/admin', function () {
  Meteor.call('isAdmin', function (error, response) {
    if (!response){
      Router.go('/');
    }
  });
  this.render('Admin');
});

Router.route('/uploads/:userid', function () {
  var params = this.params; 
  var id = params.userid; 
});

// Make sure user is verified
Router.onBeforeAction(function () {
  if (Meteor.loggingIn()){
    this.render('User');
  } else if (Meteor.user() && Meteor.user().emails && !Meteor.user().emails[0].verified) {
    this.render('verification');
  } else {
    this.next();
  }
});

AccountsTemplates.configure({
  // Behavior
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  sendVerificationEmail: true,
  lowercaseUsername: true,
  focusFirstInput: true,
  socialLoginStyle: "popup",

  // Appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: true,

  // Client-side Validation
  continuousValidation: true,
  negativeFeedback: true,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,

  // Redirects
  homeRoutePath: '/',
  redirectTimeout: 2000,

  // Texts
  texts: {
    button: {
      signUp: "Sign up"
    },
    socialSignUp: "Register",
    socialIcons: {
      "meteor-developer": "fa fa-rocket"
    },
    title: {
      forgotPwd: "Recover your password",
      signIn: "Sign in with your @columbia.edu address",
      signUp: "Sign up with your @columbia.edu address"  
    },
  },
});


AccountsTemplates.configure({
  defaultLayout: 'ApplicationLayout'
});

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/login',
  template: 'login',
  redirect: function(){
    var user = Meteor.user();
    if (user) {
      Router.go('/');
    }
  }
});
