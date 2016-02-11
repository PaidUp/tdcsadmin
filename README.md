About this project
---
Frontend: AngularJs (/client)
Backend: Node - Express (/server)
API Documentation: Swagger (/swagger)
Commerce Server: Magento (/commerce)

Setting up full stack
---
npm install
bower install
npm install -g generator-angular-fullstack

Setting up Local Development
---
**Define your host names (/etc/hosts)**

127.0.0.1	dev.convenienceselect.com

127.0.0.1	dev-commerce.convenienceselect.com

**Javascript libraries**
```
sudo npm install -g node
sudo npm install -g express
sudo npm install -g sails
```

**Folders**
```
mkdir -p var/logs
mkdir -p media/docs
```
**Install AMPPS**

**Import Magento Database**
(request database sql file)

**Edit httpd.conf (/Applications/AMPPS/apache/conf/httpd.conf)**
```
User jessejaviercogollo
Group staff
```
Search and replace `/Applications/AMPPS/www` for `/Users/YOUR_PATH_HERE`

**Add at the end of Apache httpd.conf (/Applications/AMPPS/apache/conf/httpd.conf)**
```
LoadModule slotmem_shm_module modules/mod_slotmem_shm.so
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
LoadModule proxy_ftp_module modules/mod_proxy_ftp.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_ajp_module modules/mod_proxy_ajp.so
LoadModule proxy_connect_module modules/mod_proxy_connect.so
<VirtualHost dev.convenienceselect.com:80>
    ServerName dev.convenienceselect.com
    ServerAdmin webmaster@localhost
    SetEnv APPLICATION_ENV development

    # Swagger
    ProxyPass /docs http://localhost:8002/docs
    ProxyPass /api-docs http://localhost:8002/api-docs

    # NodeJS server
    ProxyPass /api http://localhost:1337

    # Commerce server
    ProxyPass /commerce http://dev-commerce.convenienceselect.com

    # AngularJS server
    DocumentRoot /Users/YOUR_PATH_HERE/convenience-select/frontend/app
    <Directory /Users/YOUR_PATH_HERE/convenience-select/frontend/app>
    	Options FollowSymLinks
        AllowOverride All
        Order allow,deny
        Allow from all
        RewriteEngine on
        # Don't rewrite files or directories
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]
        # Rewrite everything else to index.html to allow html5 state links
        RewriteRule ^ index.html [L]
    </Directory>
</VirtualHost>

<VirtualHost dev-commerce.convenienceselect.com:80>
    ServerName dev-commerce.convenienceselect.com
    ServerAdmin webmaster@localhost
    SetEnv APPLICATION_ENV development
    php_value error_reporting 1
    php_flag display_errors on

    DocumentRoot /Users/YOUR_PATH_HERE/convenience-select/commerce
    <Directory /Users/YOUR_PATH_HERE/convenience-select/commerce>
        Options FollowSymLinks
        AllowOverride All
        Order allow,deny
        allow from all
    </Directory>
</VirtualHost>
```

**Configure Magento**

Create config file under `/commerce/app/etc/local.xml`

Chage username, password and dbname accordongly to your server.
```
<config>
    <global>
        <install>
            <date><![CDATA[Tue, 28 Oct 2014 16:30:16 +0000]]></date>
        </install>
        <crypt>
            <key><![CDATA[a58cbc3f874079c9f1d87adba71c2db2]]></key>
        </crypt>
        <disable_local_modules>false</disable_local_modules>
        <resources>
            <db>
                <table_prefix><![CDATA[]]></table_prefix>
            </db>
            <default_setup>
                <connection>
                    <host><![CDATA[localhost]]></host>
                    <username><![CDATA[root]]></username>
                    <password><![CDATA[root]]></password>
                    <dbname><![CDATA[convenience_commerce]]></dbname>
                    <initStatements><![CDATA[SET NAMES utf8]]></initStatements>
                    <model><![CDATA[mysql4]]></model>
                    <type><![CDATA[pdo_mysql]]></type>
                    <pdoType><![CDATA[]]></pdoType>
                    <active>1</active>
                </connection>
            </default_setup>
        </resources>
        <session_save><![CDATA[files]]></session_save>
    </global>
    <admin>
        <routers>
            <adminhtml>
                <args>
                    <frontName><![CDATA[control]]></frontName>
                </args>
            </adminhtml>
        </routers>
    </admin>
</config>
```

Development NodeJS environment

Create config file under `/server/config/environment/development.js`

```
'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/convenience-dev'
  },

  seedDB: true,

};
```

CronJob setup
```
*/1 * * * * /usr/bin/curl http://localhost:9000/api/v1/application/cron
```


Deploying Swagger
---
    cd swagger
    npm install
    node app.js

Deploying Core Backend
---
```
cd backend
node app.js start --dev
```

Deploying Frontend - AngularJs
---
```
cd frontend
npm install
```

Running tests Core Backend - Sails
---
Development
```
cd backend
grunt test
```
Jenkins
```
cd backend
grunt jenkins
```

Running tests Frontend - AngularJs
---
Development & Jenkins
```
cd frontend
npm test
```

Setting up Magento REST oAuth
---

Install oAuth tool
```
sudo gem install oauth
```

Create Magento Consumer
```
System > Web Services > REST OAuth Consumers
```

Authorize the user
```
oauth \
  --verbose \
   --query-string \
   --consumer-key 204bdd3adbf3817d0db07b2b71c2c2f7 \
   --consumer-secret c02a9989b77838d14d20dc195551cf56 \
   --access-token-url http://dev-commerce.convenienceselect.com/oauth/token \
   --authorize-url http://dev-commerce.convenienceselect.com/oauth/authorize \
   --request-token-url http://dev-commerce.convenienceselect.com/oauth/initiate \
   authorize
```

Change url to authorize and get the confirmation authorization code
```
from
http://127.0.0.1/htdocs/magento_1_9_0_1/oauth/authorize?oauth_token=aeedbc3ee2627977f75ff4ad67fadf41
to
http://127.0.0.1/htdocs/magento_1_9_0_1/admin/oauth_authorize?oauth_token=aeedbc3ee2627977f75ff4ad67fadf41
```

Now it's authorized, we got:
```
consumer-key: 204bdd3adbf3817d0db07b2b71c2c2f7
consumer-secret: c02a9989b77838d14d20dc195551cf56
oauth_token: 12518acca383cbf9207cd65613691038
oauth_token_secret: 008b905a6ca1edff7986fcd22343bfb0
```

Assign Admin role to the user
```
System > Web Services > REST Roles
Assign to the authenticated admin user
```

How it work on JavaScript?
```
cd research/node-oauth/examples
mocha magento.js
```

Setting up Front end integration test with Protractor
---

Protractor is a node program. Can be installed with:
```
npm install protractor
npm install grunt-protractor-runner
```
Should do anyhow a npm install for getting other dependencies it will install dependecies with webdriver-manager. You will neeed to update the version of the webdriver manager with:

```
sudo webdriver-manager update
node node_modules/grunt-protractor-runner/scripts/webdriver-manager-update
```


This will give the proper controller and conector with chrome and firefow for direct conections with the browsers. For other cases can be used the selenium server, included in webdriver-manager.


The main diference in running the test between selenium and direct conections are speed, Direct conection is faster.


Selenium can be used to check on other browsers as Safari and IE.


The config file for runing the test should work as is. Coul present problems starting the grunt server on localhost machines, as this process can become slow.


For running the End 2 End tests (integration tests) jus type:
```
grunt test:e2e (for all tests)
grunt test:e2e:loan (only loan happy path)
grunt test:e2e:credit (only credit card happy path)
```

It will open a browser window where you see the interactions happen in real tiem, as the console will output the results.

If you want to explore in realtime Protractor commands:

1. Ocate the node_modules folder
2. Run the grunt serve in a console window
3. In other console window go to: node_modules/protractor/bin
4. Execute node elementexplorer

this will open a browser window with blank adress and a promt to execute protractor commands. This commands will execute in real time in the browser window.
