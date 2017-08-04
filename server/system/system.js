ServiceConfiguration.configurations.remove({
  service: "google"
});

ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: "209528251350-aearhkobbmti2s2irhk897hvcverboob.apps.googleusercontent.com",
  loginStyle: "popup",
   secret: "Ppu6S-VDzTBV89Z58EmeTJGd"

});

ServiceConfiguration.configurations.upsert({
  service: "google"
}, {
  $set: {
    clientId: "209528251350-aearhkobbmti2s2irhk897hvcverboob.apps.googleusercontent.com",
    loginStyle: "popup",
    secret: "Ppu6S-VDzTBV89Z58EmeTJGd"
  }
});