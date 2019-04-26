Meteor.methods({
  isAdmin: function () {
    return IsAdmin(Meteor.userId());
  },
  countMeetings: function () {
    return MeetingsCollection.find().fetch().length;
  },
  getPeopleYears: function() {
    return PeopleCollection.rawCollection().distinct('year');
  },
  getPeopleSchools: function() {
    return PeopleCollection.rawCollection().distinct('school');
  },
  getPeopleMajors: function() {
    return PeopleCollection.rawCollection().distinct('major');
  },
  getPeopleLikes: function() {
    return PeopleCollection.rawCollection().distinct('likes');
  },


  /* Explanation of variable names
  sender and receiver are primary keys
  senderName and receiverName are first names
  senderUni and receiverUni are the part of emails before the @ (e.g. uni1234 or firstname.lastname)
  sender and receiver are userDoc._id
  senderName and receiverName are obtained from userDoc.name
  senderUni and receiverUni are userDoc.uni
  userDoc.uni isn't always an actual uni
  because it's made from the emails people sign up with and many people choose aliases
  the variable names will make more sense in the near future when
  1) we switch to only OAUTH for login, which will force new accounts to be made with unis
  2) we update the existing acounts so every userObject.uni is actually a uni

  remaining mysteries: why is the user with a given id accessed with findOne({owner: x })?
  1) x = Meteor.userId = userDoc._id = primary key everywhere I (Sanford) have looked
  2) owner is not a Meteor or a Mongo concept
  3) the total number of owners in PeopleCollection is less than the total number of ids
   */
  processSendRequest: function (sender, receiver, receiverUni, receiverName, additionalMessage, recaptcha) {
    // Check recaptcha
    if(!reCAPTCHA.verifyCaptcha(this.connection.clientAddress, recaptcha)) {
      return "We're not sending that request since we suspect that you're a robot";
    }

    var senderUni = PeopleCollection.findOne({owner: sender }).uni;
    var senderName = PeopleCollection.findOne({owner: sender }).name;
    var senderEmail = PeopleCollection.findOne({owner: sender }).username;

    var receiverEmail = PeopleCollection.findOne({ owner: receiver }).username;

    if (senderUni == receiverUni){
      return "Cannot send a coffee request to yourself";
    }

    if(BlacklistCollection.find({ uni: senderUni }).fetch().length > 0) {
      return "The UNI " + senderUni + " has been blacklisted";
    }

    if(MeetingsCollection.find({ sender_uni: senderUni, receiver_uni: receiverUni }).fetch().length > 0) {
      return "You've already sent a coffee request to " + receiverName;
    }

    if (senderUni != null) {
        console.log("senderUni" + senderUni);

        this.unblock();
        SendEmailForCoffee(senderUni, senderEmail, senderName, receiverUni, receiverEmail, receiverName, additionalMessage);

        return "Email sent to " + receiverName;
    } else {
      return "You must be logged in to send CoffeeRequests!";
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
    Meteor.users.remove(id);
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

var SendEmailForCoffee = function (senderUni, senderEmail, senderName, receiverUni, receiverEmail, receiverName, additionalMessage) {
  var to = receiverEmail;
  var replyTo = senderEmail;
  var cc = senderEmail;
  var from = 'do-not-reply@coffeecu.com';
  var subject = 'Coffee@CU: Request from ' + senderName;
  var body = `Hi ${receiverName},
    \n${senderName} wants to chat with you!
    \nHere's the message they included: \n${additionalMessage}
    \n${senderName}'s email is ${senderEmail}. You two should set some time to hang out. Some great places to meet at Columbia are: Joe Coffee in NoCo or in the Journalism building, Peet's in the Milstein Center, Carleton Lounge in Mudd, Cafe East in Lerner, Hungarian Pastry Shop on Amsterdam, Liz's Place in the Diana Center or Brownie's Cafe in Avery. Have a great time talking!
    \nCheers,\nThe Coffee@CU Team
    \nVisit http://coffeecu.com to meet more Columbians.\n`;

  console.log({
    to: to,
    replyTo: replyTo,
    cc: cc,
    from: from,
    subject: subject,
    text: body
  });

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

var LogMeeting = function(senderUni, receiverUni) {
  MeetingsCollection.insert({sender_uni: senderUni, receiver_uni: receiverUni});
};

IsAdmin = function(id) {
  return Meteor.settings.private.admins.indexOf(id) > -1;
};