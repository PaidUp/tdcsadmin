'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: 9020,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'convenience-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/convenience-dev',
    options: {
      db: {
        safe: true
      },
      prefix:'TDcsApp_'
    }

  },

  facebook: {
    clientID:     process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  // Email system
  emailService:{
    service: 'gmail',
    auth: {
      user: 'convenieceselect@gmail.com',
      pass: 'Test4echo'
    }
  },

  emailTemplateRoot:path.normalize(__dirname + '/../../../server/views/email'),
  emailOptions:{
    from: 'Convenience Select <ourteam@convenienceselect.com>',
    subject: 'Default Subject (ourteam)'
  },
  emailOptionsAlerts:{
    from: 'Convenience Select <alerts@convenienceselect.com>',
    subject: 'Default Subject (alerts)'
  },
  emailVars: {
    companyName : "Convenience Select",
    baseUrl : "http://localhost:9000",
    prefix : '[DEV] '
  },
  emailContacts : {
    contact : 'convenieceselect@gmail.com',//ourteam@cs.com
    admin : 'convenieceselect@gmail.com',//alerts@cs.com
    developer : 'convenieceselect@gmail.com'//alerts@cs.com
  },

  // contract data
  contractData: {
    contractTemplateRoot: path.normalize(__dirname + '/../../../server/views/loan'),
    convenienceSelect: {
      state: 'Texas',
      creditor: 'Convenience Select, LLC',
      address: '2900 North Quinlan Park Rd. Suite 240-320.',
      city: 'Austin',
      zip: '78732',
      phone: '(855) 764-3232',
      lateChargeDays: '10',
      lateChargePercentage: '5%',
      paymentWithin: '10',
      interestRate: '18% per year',
      agreeToAFeedOf: '$30',
      reInitDebitTimes: 'two',
      calendarDaysAferDebit: 'ten',
      CellPhoneNumber: 6466623303,
      unsubscribeEmailTo: 'ourteam@convenienceselect.com',
      customerServiceTelephoneNumber: '(855) 764-3232',
      signedAt: 'Convenience Select, LLC'
    },
    clientData: {
      DisputesTelephoneNumber: '(855) 764-3232',
      canSendMailAt: '2900 North Quinlan Park Rd. Suite 240-320. Autin, TX 78732',
      canCallYouAt: '(855) 764-3232'
    }
  },

  // Commerce settings
  commerce: {
    magento: {
      host: 'develop.convenienceselect.com',
      port: 8888,
      path: '/api/xmlrpc/',
      login: 'magento',
      pass: 'Sv38SJVR'
    },
    category: {
      teams: 3,
      merchandise: 4
    },
    products: {
      fee: {
        id: 9,
        sku: "fee"
      },
      interest: {
        id: 10,
        sku: "interest"
      },
      defaultValue:{
        visibility:'4',
        urlPath:'urlPath',
        urlKey:'urlKey',
        taxClassId:'0',
        status:'1',
        price:'100',
        websites:'1',
        set:'9',
        type:'grouped'
      }
    },
    testing: {
      teamId: 2
    },
    defaultAddress:
    [
        {
          mode: "billing",
          firstName: "cs firstName",
          lastName: "cs lastName",
          address1: "801 east 11th st",
          address2: "801 east 11th st",
          city: "Austin",
          state: "TX",
          zipCode: "78702",
          country: "US",
          telephone: "+1 320123245"
        },
        {
          mode: "shipping",
          firstName: "firstName cs",
          lastName: "lastName cs",
          address1: "801 east 11th st",
          address2: "801 east 11th st",
          city: "Austin",
          state: "TX",
          zipCode: "78702",
          country: "US",
          telephone: "+1 320123245"
        }
    ],
    shippingMethod: 'freeshipping_freeshipping',
    paymentMethod: 'purchaseorder'
  },
  payment:{
    legalEntity:{
      type: 'company'
    }
  },
  balanced: {
    api: "ak-test-p8Ob9vp9GnqWNwFf6CeLLokeQsf76RIe",
    marketplace: "TEST-MP2OaM2stYkoWBlGFd0M8YV7",
    appearsOnStatementAs: "Conv. Select"
  },
  stripe:{
    apiPublic: "pk_test_J5gfockQi2DP28GszFZvTnwS"
  },
  mixpanel:{
    apiKey: "254e7cd14a29f087143735b673e51d65"
  },
  encryptKey:'PZ3oXv2v6Pq5HAPFI9NFbQ==',
  loan:{
    defaults: {
      interestRate: 8.99,
      periodDuration: 1,
      periodType: 'minutes',
      billingFormat: 'MM/DD hh:mm',
      billingDate: '',
      billingDelay: 3,
      billingDelayType: 'minutes'
    },
    application: {
      user:{
        encryptKey:'PZ3oXv2v6Pq5HAPFI9NFbQ=='
      }
    },
    contract: {
      htmlPdfOptions: {
        timeout: 60000,
        "format": "A4",
        "orientation": "portrait",
        // Page options
        "border": "0",
        "header": {
          "height": "45mm",
          "contents": '<div style="text-align: right;">CS</div>'
        },
        "footer": {
          "height": "28mm",
          "contents": '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>'
        },

        "type": "pdf",
        "quality": "10",

        "directory": path.normalize(__dirname + '/../../..') + "/media/docs/"
      }
    }
  },
  notifications:{
    reminderNoPaymentAdded:{
      period:'minutes',
      value:2
    },
    reminderNoBankAccountVerified:{
      period:'days',
      value:2
    },
    reminderChargeAccount:{
      period:'days',
      value:1
    },
    reminderEmailPayment:{
      period:'hours',
      value:72
    }
  },
  cronjob: {
    pidFile : path.normalize(__dirname + '/../../..') + '/var/cronjob.pid',
    pathPidFile : path.normalize(__dirname + '/../../..') + '/var/'
  },
  connections:{
    me:{
      token: 'TDCSAppToken-CHANGE-ME'
    },
    user: {
      urlPrefix: '/api/v1',
      isHttp: false,
      host: 'localhost',
      port: 9001,
      token: 'TDUserToken-CHANGE-ME!'
    },
    payment: {
      urlPrefix: '/api/v1',
      isHttp: false,
      host: 'localhost',
      port: 9005,
      token: 'TDPaymentToken-CHANGE-ME!'
    },
    loan: {
      urlPrefix: '/api/v1',
      isHttp: false,
      host: 'localhost',
      port: 9004,
      token: 'TDLoanToken-CHANGE-ME!'
    },
    commerce: {
      urlPrefix: '/api/v1',
      isHttp: false,
      host: 'localhost',
      port: 9002,
      token: 'TDCommerceToken-CHANGE-ME!',
      baseUrl: 'http://localhost:9002'
    },
    userLoan: {
      urlPrefix: '/api/v1',
      isHttp: false,
      host: 'localhost',
      port: 9010,
      token: 'TDUserLoanToken-CHANGE-ME!'
    },
    schedule: {
      urlPrefix: '/api/v2',
      isHttp: false,
      host: 'localhost',
      port: 9006,
      token: 'tdschedule-secret'
    },
  },
  logger : {
    token : 'f5ea6cdf-b8c0-44ca-962f-1328873c5974'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
