Meteor.startup(function() {
    reCAPTCHA.config({
        sitekey: Meteor.settings.public.recaptcha.key
    });
});

Tracker.autorun(function () {
  Meteor.subscribe('people-master');
});

Session.set('currentlySelected', null);

Template.people.rendered = function () {
  $(document).ready(function(){
    $('.ui.accordion').accordion({exclusive: true});

    window.onscroll = function(ev) { if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      setTimeout(function(){
        $('.load-more-button').click();
      }, 100);
    }};
  });
};


Template.intro.helpers({
  'welcome': function () {
    return data.welcome;
  }
});

Template.meetingsMade.rendered = function () {
  // Update #meetings every second
  Meteor.setInterval(function () {
    Meteor.call('countMeetings', function (error, response) {
      Session.set('meetings', response);
    });
  }, 1000);
};

Template.meetingsMade.helpers({
  'meetings': function () {
    return Session.get('meetings');
  }
});

Template.people.helpers({
  'people': function () {
    return PeopleCollection.find().fetch();
  },
  'peopleIndex': function () {
    return PeopleIndex;
  },
  'inputAttributes': function () {
    return {
      placeholder: 'Search by name, school, UNI, major, about, contact for, availability and likes'
    };
  },
  'loadButtonAttributes': function () {
    return {
      class: 'waves-effect waves-light btn load-more-button'
    };
  },
  'makeVisible': function () {
    return this.make_public || Meteor.userId();
  }
});


Template.people.events({
  'click #contact': function () {

    for (property in this){
      console.log(property);
    }
    //Session.set('currentlySelected', { owner: this.owner, uni: this.uni, name: this.name.split(' ')[0], image: this.image, makeVisible:this.makeVisible });
    Session.set('currentlySelected', this);
    //Template.uniPrompt.name = this.name.split(' ')[0]);
    
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
    }).modal('attach events', '.first.modal .button.primary');
  // show first now
  $('.first.modal').modal({name: Session.get('currentlySelected').name})
    .modal('show')
  ;
/*
    $('.ui.modal').modal({
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
    }).modal('show');
*/    
  }
});

Template.uniPrompt.helpers({
  getUserProperty(property){
    currentuser = Session.get("currentlySelected");
    if(currentuser){
      return currentuser[property];
    }else{ 
      return "";
    }
  }

});
