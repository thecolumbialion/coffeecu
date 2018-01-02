Meteor.startup(function() {
  if (Meteor.isClient) {
    return SEO.config({
      title: 'Coffee@CU',
      meta: {
        'description': 'Make friends, get mentors, and make the Columbia community stronger.'
      },
      og: {
        'title': 'Coffee@CU'
      }
    });
  }
});
