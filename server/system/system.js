ServiceConfiguration.configurations.remove({
  service: "google"
});

ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: Meteor.settings.private.google.clientId,
  loginStyle: "popup",
   secret: Meteor.settings.private.google.secret

});

ServiceConfiguration.configurations.upsert({
  service: "google"
}, {
  $set: {
    clientId: Meteor.settings.private.google.clientId,
    loginStyle: "popup",
    secret: Meteor.settings.private.google.secret
  }
});


