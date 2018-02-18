Meteor.methods({
  isAdmin: function () {
    return IsAdmin(Meteor.userId());
  },
  countMeetings: function () {
    return MeetingsCollection.find().fetch().length;
  },

  getSenderUni: function(id) {
    var convertAsyncToSync  = Meteor.wrapAsync(function(id) {
      var user = PeopleCollection.findOne({owner: id});
      //console.log("in function");
      //console.log(user['uni']);
      result = user['uni'];
    }),
      resultOfAsyncToSync = convertAsyncToSync(id, {} );
    return resultOfAsyncToSync;
  },

  processSendRequest: function (senderId, receiver, receiverUni, receiverName, additionalMessage, recaptcha) {
    // Check recaptcha
    if(!reCAPTCHA.verifyCaptcha(this.connection.clientAddress, recaptcha)) {
      return "We're not sending that request since we suspect that you're a robot";
    }

    var senderUni = PeopleCollection.findOne({owner: senderId})['uni'];
    if (senderUni == receiverUni){
      return "Cannot send a coffee request to yourself";
    }

    if(BlacklistCollection.find({ uni: senderUni }).fetch().length > 0) {
      return "The UNI " + senderUni + " has been blacklisted";
    }

    if(MeetingsCollection.find({ sender_uni: senderUni, receiver_uni: receiverUni }).fetch().length > 0) {
      return "You've already sent a coffee request to " + receiverName;
    }

    var receiverEmail = PeopleCollection.findOne({ owner: receiver }).username;

    if (senderUni != null) {
      // Check UNI cache first
      console.log("senderUni" + senderUni);
      var uni_details = UniCollection.find({ uni: senderUni }).fetch();
      // If in cache, use that first
      if (uni_details.length > 0) {
        senderName = uni_details[0].name;

        this.unblock();
        SendEmailForCoffee(senderUni, senderName, receiverUni, receiverEmail, receiverName, additionalMessage);

          this.unblock();
          var senderName = GetFirstName(senderUni);
          UniCollection.insert({uni: senderUni, name: senderName});

          SendEmailForCoffee(senderUni, senderName, receiverUni, receiverEmail, receiverName, additionalMessage);
      }
      return "Email sent to " + receiverName;
    }else{
      return "You must be logged in to send CoffeeRequests!"
    }
  },
  rejectPendingUser: function (id, reason) {
    // Only admin can reject a user
    if (!IsAdmin(Meteor.userId())) {
      return;
    }
    // Move to rejected users
    var userToMove = PendingPeopleCollection.findOne({owner: id});
    RejectedPeopleCollection.update({owner: id},
                                    {$set: {
                                      owner: id,
                                      username: userToMove.username,
                                      name: userToMove.name,
                                      uni: userToMove.uni,
                                      school: userToMove.school,
                                      year: userToMove.year,
                                      major: userToMove.major,
                                      pronouns: userToMove.pronouns,
                                      pronounsBox: userToMove.pronounsBox,
                                      about: userToMove.about,
                                      likes: userToMove.likes,
                                      contactfor: userToMove.contactfor,
                                      availability: userToMove.availability,
                                      twitter: userToMove.twitter,
                                      facebook: userToMove.facebook,
                                      linkedin: userToMove.linkedin,
                                      website: userToMove.website,
                                      make_public: userToMove.make_public,
                                      image: userToMove.image,
                                      random_sort: userToMove.random_sort
                                    }},
                                    {upsert: true});
                                    PendingPeopleCollection.remove({ owner: id });

                                    // Send email
                                    var to = userToMove.username;
                                    var from = 'do-not-reply@coffeecu.com';
                                    var subject = 'Coffee@CU: Profile update declined';
                                    var body = "Hi,\n\n" +
                                      "Your recent profile update request to Coffee@CU was rejected.\n\nReason: " + reason + "\n\nPlease make the above changes and request an update to your profile again at http://coffeecu.com.\n\nCheers,\nThe Coffee@CU Team ";
                                    SendEmail(to, "", from, subject, body);
  },
  insertPendingUser: function (id,
                               username,
                               name,
                               uni,
                               school,
                               year,
                               major,
                               pronouns,
                               pronounsBox,
                               about,
                               likes,
                               contactfor,
                               availability,
                               twitter,
                               facebook,
                               linkedin,
                               website,
                               make_public,
                               image,
                               random_sort
                              ) {
                                if (!Meteor.userId()) {
                                  throw new Meteor.Error('not-authorized');
                                }

                                PendingPeopleCollection.update(
                                  {owner: id},
                                  {$set: {
                                    owner: id,
                                    username: username,
                                    name: name,
                                    uni: uni,
                                    school: school,
                                    year: year,
                                    major: major,
                                    pronouns: pronouns,
                                    pronounsBox: pronounsBox,
                                    about: about,
                                    likes: likes,
                                    contactfor: contactfor,
                                    availability: availability,
                                    twitter: twitter,
                                    facebook: facebook,
                                    linkedin: linkedin,
                                    website: website,
                                    make_public: make_public,
                                    image: image,
                                    random_sort: random_sort
                                  }},
                                  {upsert: true});
                                  RejectedPeopleCollection.remove({ owner: id });
                              },
                              moveUserToMaster: function (id) {
                                // Only admin can move user to master
                                if (!IsAdmin(Meteor.userId())) {
                                  return;
                                }
                                var userToMove = PendingPeopleCollection.findOne({owner: id});
                                PeopleCollection.update({ owner: id },
                                                        {$set: {
                                                          owner: id,
                                                          username: userToMove.username,
                                                          name: userToMove.name,
                                                          uni: userToMove.uni,
                                                          school: userToMove.school,
                                                          year: userToMove.year,
                                                          major: userToMove.major,
                                                          pronouns: userToMove.pronouns,
                                                          pronounsBox: userToMove.pronounsBox,
                                                          about: userToMove.about,
                                                          likes: userToMove.likes,
                                                          contactfor: userToMove.contactfor,
                                                          availability: userToMove.availability,
                                                          twitter: userToMove.twitter,
                                                          facebook: userToMove.facebook,
                                                          linkedin: userToMove.linkedin,
                                                          website: userToMove.website,
                                                          make_public: userToMove.make_public,
                                                          image: userToMove.image,
                                                          random_sort: userToMove.random_sort
                                                        }},
                                                        {upsert: true});
                                                        PendingPeopleCollection.remove({owner: id});
                                                        RejectedPeopleCollection.remove({owner: id});
                              },
                              deleteUser: function (id) {
                                if (!IsAdmin(Meteor.userId()) && id != Meteor.userId()) {
                                  throw new Meteor.Error('not-authorized');
                                }
                                PeopleCollection.remove({ owner: id });
                                PendingPeopleCollection.remove({ owner: id });
                                RejectedPeopleCollection.remove({ owner: id });
                              }
});

SyncedCron.add({
  name: 'Randomize people order every once in a while',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.cron('0 4 * * *');
  },
  job: function() {
    people = PeopleCollection.find();
    people.forEach(function randomize(person) {
      id = person.owner;
      PeopleCollection.update(
        {owner: id},
        {$set: {
          random_sort: Math.random()
        }}
      );
    });
  }
});

var SendEmailForCoffee = function (senderUni, senderName, receiverUni, receiverEmail, receiverName, additionalMessage) {
  var to = receiverEmail;
  var replyTo = receiverEmail;
  var cc = senderUni + '@columbia.edu';
  var from = 'do-not-reply@coffeecu.com';
  var subject = 'Coffee@CU: Request from ' + senderName;
  var body = "Hi " + receiverName + ",\n\n" +
    senderName + " (cc'ed) wants to chat with you.\n\n" + "Here's the message they included: " + additionalMessage
    + "\n\nYou two should set some time to hang out. Some great places to meet at Columbia are: Joe's in NoCo, Up Coffee in the Journalism building, Brownie's Cafe in Avery, Carleton Lounge in Mudd or Cafe East in Lerner. Have a great time talking!\n\n" +
    "Cheers,\nThe Coffee@CU Team\n\n" + "Visit http://coffeecu.com to meet more Columbians.\n";

  SendEmail(to, replyTo, cc, from, subject, body);
  LogMeeting(senderUni, receiverUni);
};


var SendEmail = function (to, replyTo, cc, from, subject, body) {
  check([to, replyTo, cc, from, subject, body], [String]);

  Email.send({
    to: to,
    replyTo: replyTo,
    cc: cc,
    from: from,
    subject: subject,
    text: body
  });
};

var GetFirstName = function (uni) {
  var convertAsyncToSync  = Meteor.wrapAsync(HTTP.get),
    resultOfAsyncToSync = convertAsyncToSync('http://uniatcu.herokuapp.com/info?uni=' + uni, {});
  var firstname = resultOfAsyncToSync.data.data.name.split(' ')[0];
  return firstname;
};

var LogMeeting = function(senderUni, receiverUni) {
  MeetingsCollection.insert({sender_uni: senderUni, receiver_uni: receiverUni});
};

IsAdmin = function(id) {
  return Meteor.settings.private.admins.indexOf(id) > -1;
};
