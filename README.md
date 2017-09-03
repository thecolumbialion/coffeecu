# Coffee at Columbia

To run locally, clone the repo with `git clone --recursive https://github.com/parthibanloganathan/coffeecu.git` so that you get the submodule for [materialize-custom](https://github.com/parthibanloganathan/materialize-custom) as well.

You need to create a file called `settings.json` at `coffeecu/` formatted as follows:
```
{
  "public": {
    "recaptcha": {
      "key": [
        "<RECAPTCHA KEY>"
      ]
    }
  },
  "private": {
    "mailgun": {
      "username": [
        "<MAILGUN USERNAME>"        
      ],
      "password": [
        "<MAILGUN PASSOWRD>"
      ]
    },
    "google": {
      "clientId": [
        "<GOOGLE CLIENT ID>"
      ],
      "secret": [
        "<GOOGLE CLIENT SECRET>"
      ]
    },
    "recaptcha": {
      "secret": [
        "<RECAPTCHA SECRET>"
      ]
    },
    "admins": [
      "<ID OF ADMIN>"
    ]
  }
}

```

Install Meteor first with `curl https://install.meteor.com/ | sh`. Finally perform `./run.sh` to start the app and view it in your browser at `http://localhost:3000`.

Only tested on Chrome. ¯\\\_(ツ)_/¯


Dependencies
------------
For login:
- accounts-password
- accounts-google
- acccounts-ui
- service-configuration
- useraccounts:core
- useraccounts:materialize
- useraccounts:iron-routing

For styling:
- materialize:materialize-custom
- semantic:ui
- fourseven:scss (to compile SCSS for materialize)

For email:
- cunneen:mailgun (need to create Mailgun account too)

For search:
- easy:search

For image upload:
- tomi:upload-server
- tomi:upload-jquery

For routing:
- iron:router

For bug tracking:
- meteorhacks:kadira

For SEO:
- manuelschoebel:ms-seo

For recaptcha:
- bratanon:recaptcha


# Access the server:
We run this site on a Digital Ocean maintained by the ADI team. 
For those authorized to work on the site, you need to generate a key that we use to authenticate your device before accessing the site.
To generate this key, go to Terminal and type:
“ssh-keygen -t rsa -b 4096”
“ssh-keygen -t rsa”

Do not enter a passphrase or password — just click enter until the key is generated. This command will print out a fingerprint from your key. Since we need the full key, use vim or nano on the file path the key is saved in. Note: a fingerprint will look something like this:
“SHA256:AnrDG1bkV9u4HR6CVw4Qvo8EXkhPpyzxf+Bhn+GZnLU” 

You will need the file path to the public key for deploying the app, so be sure to save it. 
Once you have gotten the actual key, log into the Digital ocean account. Click the profile photo image, go to settings, then security, and an account for your name. In the box that pops up, paste your full key. If done correctly, you will now be able to ssh into the droplet from your computer by typing:
ssh root@coffeecu.com (if that fails, you can also try ssh root@162.243.165.50 or whatever the IP address you are working with is)

For trouble shooting, you can visit https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-freebsd-server for more tips and instructions.



# Deployment:
To simplify the deployment process we use Meteor Up, a great tool that allows you to deploy a Meteor app to a server. 

To use it, follow the instructions on the Github (https://github.com/zodern/meteor-up) page exactly. If you run into an error during the process, you most likely did not follow the instructions exactly. Make sure to try again 

You mup.js file should look like this
``` module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: ‘{INSERT DROPLET IP ADDRESS HERE}’,
      username: 'root',
//this path may be different for you if you saved key in a different location
       pem: '~/.ssh/id_rsa' 
    }
  },

  meteor: {
    // TODO: change app name and path
    name: 'coffeecu',
    path: ‘{path to coffeecu files on your local computer}’,

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://coffeecu.com',
      MONGO_URL: 'mongodb://localhost/meteor',
//mailgun url      
MAIL_URL: ‘MAIL URL’,
    },

    // ssl: { // (optional)
    //   // Enables let's encrypt (optional)
    //   autogenerate: {
    //     email: 'email.address@domain.com',
    //     // comma seperated list of domains
    //     domains: 'website.com,www.website.com'
    //   }
    // },

    docker: {
           image: 'abernix/meteord:base',
      // imagePort: 80, // (default: 80, some images EXPOSE different ports)
    },

    // This is the maximum time in seconds it will wait
    // for your app to start
    // Add 30 seconds if the server has 512mb of ram
    // And 30 more if you have binary npm dependencies.
    deployCheckWaitTime: 300,

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    port: 27017,
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
}; 
```


Hacks:
-----
materialize:materialize-custom is found in `/packages` and is pulled from [the GitHub repo](https://github.com/Dogfalo/materialize) and has the following modifications:
`sass/components/_variables.scss` is modified for a custom color scheme. But we have to compile this scss. So in `package.js`, we add `api.use('fourseven:scss');` and 
```
  api.addFiles([
    'dist/js/materialize.js',
    // Added custom
    'sass/components/_buttons.scss',
    'sass/components/_cards.scss',
    'sass/components/_carousel.scss',
    'sass/components/_chips.scss',
    'sass/components/_collapsible.scss',
    'sass/components/_color.scss',
    'sass/components/_dropdown.scss',
    'sass/components/_form.scss',
    'sass/components/_global.scss',
    'sass/components/_grid.scss',
    'sass/components/_icons-material-design.scss',
    'sass/components/_materialbox.scss',
    'sass/components/_mixins.scss',
    'sass/components/_modal.scss',
    'sass/components/_navbar.scss',
    'sass/components/_normalize.scss',
    'sass/components/_prefixer.scss',
    'sass/components/_preloader.scss',
    'sass/components/_roboto.scss',
    'sass/components/_sideNav.scss',
    'sass/components/_slider.scss',
    'sass/components/_table_of_contents.scss',
    'sass/components/_tabs.scss',
    'sass/components/_toast.scss',
    'sass/components/_tooltip.scss',
    'sass/components/_typography.scss',
    'sass/components/_variables.scss',
    'sass/components/_waves.scss',
    'sass/components/date_picker/_default.date.scss',
    'sass/components/date_picker/_default.scss',
    'sass/components/date_picker/_default.time.scss',
    'sass/materialize.scss',
    //
  ], 'client');
```


