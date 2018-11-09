Coffee@CU
=========

[Coffee@CU][coffeecu] brings Columbia students, faculty, and alumni closer together--one coffee chat at a time. Maintained by ADI Labs.

Setup
-----

1. To run locally, clone the repository to your local drive using: `git clone https://github.com/thecolumbialion/coffeecu.git`

2. Create a file called `settings.json` in your local repository formatted as follows:

```json
{
  "public": {
    "recaptcha": {
      "key": [
        "<recaptcha-key>"
      ]
    }
  },
  "private": {
    "mailgun": {
      "host": "smtp.mailgun.org",
      "username": "<mailgun-username>",
      "password": "<mailgun-password>",
      "port": 587
    },
    "google": {
      "clientId": "<google-client-id>",
      "secret": "<google-secret-key>"
    },
    "recaptcha": {
      "secret": "<recaptcha-secret-key>"
    },
    "admins": [
      "<admin-id>"
    ]
  }
}
```

3. Install Meteor with `curl https://install.meteor.com/ | sh`.

4. Install the `babel-runtime` package using: `npm install --save babel-runtime`.

4. Use the command `run.sh` to serve the app locally. If it works, visit [http://localhost:3000] to view the app. You can also specify a different port number with `--port=<port>`.

5. To restore the local database, email coffeecu@adicu.com to get a database backup. Run `mongorestore -h 127.0.0.1 --port 3001 -d meteor path-to-database-backup/backups/db_dump/coffeecu`.

Deployment
----------

To simplify the deployment process we use [Meteor Up][mup], a great tool that allows you to deploy a Meteor app to a server. For deploying with Meteor Up, you'll need to create a `.deploy` folder that also includes a `settings.json` file and a `mup.js` file. Then, follow the instructions on the [Meteor Up Github][mup-github] page exactly.

Your mup.js file should be formatted as follows:

```javascript
module.exports = {
  servers: {
    one: {
      host: '<ip-address>',
      username: 'root',
      pem: '<path-to-private-key>' 
    }
  },

  meteor: {
    name: 'coffeecu',
    path: '<path-to-local-files>',

    volumes: {
      '/upload': '/upload'
    },

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      ROOT_URL: 'https://coffeecu.com',
      MONGO_URL: 'mongodb://localhost/meteor',
      MAIL_URL: '<mailgun-url>',
    },

    docker: {
      image: 'abernix/meteord:base',
      prepareBundle: false
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
  },

  proxy: {
    domains: 'coffeecu.com,www.coffeecu.com',

    ssl: {
      // Enable Let's Encrypt
      forceSSL: true,
      letsEncryptEmail: '<letsencrypt-email>'
    }
  }
}; 
```

Access the Server
-----------------

[Coffee@CU][coffeecu] is hosted on DigitalOcean and maintained by ADI Labs. For those authorized to work on the site, generate an ssh key if you do not have one using the following: `ssh-keygen -t rsa -b 4096`

Find your key's fingerprint by examining the file the key was generated in. Note: A fingerprint will look something like `SHA256:AnrDG1bkV9u4HR6CVw4Qvo8EXkhPpyzxf+Bhn+GZnLU`.

Once you have gotten the actual key, log into DigitalOcean. Go to Settings --> Security, and an account for your name. In the box that pops up, paste your full key. If done correctly, you will now be able to ssh into the droplet from your computer by typing: `ssh root@coffeecu.com`.

For troubleshooting, you can visit [this](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-freebsd-server) DigitalOcean Community post for more tips and instructions.

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

Hacks
-----

materialize:materialize-custom is found in `/packages` and is pulled from [the GitHub repo](https://github.com/Dogfalo/materialize) and has the following modifications:
`sass/components/_variables.scss` is modified for a custom color scheme. But we have to compile this scss. So in `package.js`, we add `api.use('fourseven:scss');` and 
```javascript
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

[coffeecu]: https://coffeecu.com
[mup]: http://meteor-up.com/
[mup-github]: https://github.com/zodern/meteor-up
