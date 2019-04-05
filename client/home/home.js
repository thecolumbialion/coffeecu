Meteor.startup(function() {
    reCAPTCHA.config({
        sitekey: Meteor.settings.public.recaptcha.key
    });
});

Tracker.autorun(function () {
  Meteor.subscribe('people-master');
});

Session.set('currentlySelected', null);

//
Template.sortBy.events({
    "change #year-search": function (event) {
      event.preventDefault();
      var category = event.target.value;
      PeopleIndex.getComponentMethods().addProps('sortYear', category);
    },
    "change #school-search": function (event) {
      event.preventDefault();
      var category = event.target.value;
      PeopleIndex.getComponentMethods().addProps('sortSchool', category);
    },
    "change #major-search": function (event) {
      event.preventDefault();
      var category = event.target.value;
      PeopleIndex.getComponentMethods().addProps('sortMajor', category);
    },
});

Template.sortBy.helpers({
  'getyears': function() {

    Meteor.call('getPeopleYears', function (error, response) {
      Session.set('years', response.filter(Boolean).sort());
    });

    return Session.get('years');
  }, 
  'getschools': function() {

    Meteor.call('getPeopleSchools', function (error, response) {
      Session.set('schools', response.filter(Boolean).sort());
    });

    return Session.get('schools');
  },
  'getmajors': function() {

    Meteor.call('getPeopleMajors', function (error, response) {
      Session.set('majors', response.filter(Boolean).sort());
    });

    return Session.get('majors');
  }
});

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
    return "Meet amazing students in our community";
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

Template.search.helpers({
  'peopleIndex': function () {
    return PeopleIndex;
  },
  'inputAttributes': function () {
    return {
      placeholder: 'Search by name, school, UNI, major, about, contact for, availability and likes'
    };
  },
});

Template.people.helpers({
  'people': function () {
    return PeopleCollection.find().fetch();
  },
  'peopleIndex': function () {
    return PeopleIndex;
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

Template.uniPrompt.helpers({
  'getUserProperty': function(property){
    currentuser = Session.get("currentlySelected");
    if(currentuser){
      console.log(currentuser[property]);
      if(property == "major"){
        var majors = currentuser[property]; 
        return majors; 
      } 
      else {
        return currentuser[property];
      }
    }else{
      return "";
    }
  },

  /* Polyfill for the Array.isArray function
   * because it is not natively available in Meteor/Spacebars
   */ 
  'isArray': function(property) {
    currentuser = Session.get("currentlySelected");
    if(currentuser){
      return Object.prototype.toString.call(currentuser[property]) === '[object Array]';
    }else{
      return false;
    }
  }

});