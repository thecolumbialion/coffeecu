Meteor.startup(function() {
    reCAPTCHA.config({
        sitekey: Meteor.settings.public.recaptcha.key
    });
});

Tracker.autorun(function () {
  Meteor.subscribe('people-master');
});

//"currently selected" tracts the last profile clicked
Session.set('currentlySelected', null);

Template.people.rendered = function () {
  $(document).ready(function(){

    //load more profile when the user scrolls to the bottom
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
  //returns number of mealitings made
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
  //when a profile is clicked
  'click #contact': function () {

    Session.set('currentlySelected', this);
    
    //show 2 modal
    $('.coupled.modal')
      .modal({
        //make 2nd modal modal dependent on the first
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
        }//omly connect primary button or else canceling 1st modal, cancels all photos
      }).modal('attach events', '.first.modal .button.primary');
    // show first modal
    $('.first.modal').modal({name: Session.get('currentlySelected').name})
      .modal('show')
    ;  
  }
});

//template for the modals
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
