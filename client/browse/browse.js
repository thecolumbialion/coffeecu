Template.matches.rendered = function () {
  $(document).ready(function(){
    $('.ui.accordion').accordion({exclusive: true});

    window.onscroll = function(ev) { if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      setTimeout(function(){
        $('.load-more-button').click();
      }, 100);
    }};
  });
};


Template.matches.helpers({
  'matches': function () {
    return PeopleCollection.find().fetch();
  },
  'matchesIndex': function () {
    return PeopleIndex;
  },
  'loadAttributes': function () {
    return {
      class: 'waves-effect waves-light btn load-more-button'
    };
  },
  'makeVisible': function () {
    return this.make_public || Meteor.userId();
  },
  'inputAttributes': function () {
    var likes = Meteor.user().profile.likes;
    return {
      value: likes
    };
  }
});

Template.matchesFound.helpers({
  'matches': function () {
    return PeopleCollection.find().fetch()
  }
});



Template.matches.events({
  'click #contact': function () {
    /* for (property in this){
      console.log(property);
    } */


    Session.set('currentlySelected', this);

    $('.coupled.modal')

      .modal({
        allowMultiple: false
      })
    ;
    // attach events to buttons
    $('.second.modal')
      .modal({
        onApprove: function(event) {
          var receiver = Session.get('currentlySelected').owner;
          var receiverUni = Session.get('currentlySelected').uni;
          var receiverName = Session.get('currentlySelected').name;
          var additionalMessage = $("#additionalMessage").val();
          var recaptcha = reCAPTCHA.getResponse("1");
          Meteor.call('processSendRequest', Meteor.userId(), receiver, receiverUni, receiverName, additionalMessage, recaptcha,function (error, response) {
          if (error) {
              Materialize.toast('Failed to send email', 4000);
              console.log(error);
            } else {
              Materialize.toast(response, 4000);
            }
          });

          reCAPTCHA.reset("1");
        }
      }).modal('attach events', '.first.modal .button.primary')
    ;

    // show first now
    $('.first.modal').modal({name: Session.get('currentlySelected').name})
      .modal('show');
  }
});

Template.header.helpers({
  'welcome': function () {
    return "Find students who share your interests";
  }
});

