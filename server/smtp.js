Meteor.startup(function () {
  smtp = {
    username: Meteor.settings.private.mailgun.username,
    password: Meteor.settings.private.mailgun.password,
    server: Meteor.settings.private.mailgun.host,
    port: Meteor.settings.private.mailgun.port,
  }
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});
