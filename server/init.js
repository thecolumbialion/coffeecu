Meteor.startup(function () {

  // For recaptcha
  reCAPTCHA.config({
    privatekey: Meteor.settings.private.recaptcha.secret
  });


  // For image uploads using meteor-uploads
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/upload',
    checkCreateDirectories: true, // create the directories if not present
    getFileName: function (fileInfo, formData) { // rename files to <id>_dp.jpg 
      return formData.id + '_dp.jpg';
    },
    finished: function (fileInfo, formFields) {
      var re = /\w*_dp.jpg/;
      if(fileInfo.path.match(re)) {
        var url = fileInfo.path.match(re)[0];
        if(url !== null) {
          fileInfo.finalUrl = url;
        }
        else {
          fileInfo.finalUrl = '';
        }
      }
      else {
        fileInfo.finalUrl = '';
      }
    },
    maxFileSize: 10000000, // 10 MB 
    mimeTypes: {
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png"
    },
    overwrite: true
  }); 

  SyncedCron.start();
});
