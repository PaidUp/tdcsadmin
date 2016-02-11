'use strict';

angular.module('convenienceApp')
  .service('UserService', function ($resource) {
    // ============= User Service =============
      var User = $resource('/api/v1/user/:action/:userId',{
        userId: ''
      }, {
        post: { method:'POST', isArray: true }
      });

      this.save = function (user, successFn, errorFn) {
        var success = successFn || angular.noop;
        var error = errorFn || angular.noop;
        return User.save({action: 'create'}, user, success, error);
      };

      this.get = function (token, callback) {
        var cb = callback || angular.noop;
        return User.get({action: 'current', token: token}, cb);
        // return User.get({token: token}, cb);
      };

      this.getUser = function (userId) { //change name
        return User.post({}, {_id: userId}).$promise;
      };

      this.updateUser = function (user) {
        return User.save({action: 'update'}, user).$promise;
      };
    // ============= END Service =============

    // ============= User Contact Info Service =============
      var UserContactInfo = $resource('/api/v1/user/contact/:action/:userId/:contactId',{
        contactId: ''
      },{
        post: { method:'POST', isArray: true },
        update: { method:'PUT' }
      });

      this.createContact = function (contactInfo) {
        return UserContactInfo.save({action: 'create'}, contactInfo).$promise;
      };

      this.getContactList = function (contactId) { //change name
        return UserContactInfo.post({
          action: 'list',
          contactId: contactId
        }, {}).$promise;
      };

      this.getContact = function (userId, contactId) {
        return UserContactInfo.get({
          action: 'load',
          contactId: contactId,
          userId: userId
        }).$promise;
      };

      this.contactUpdate = function (contactInfo) {
        return UserContactInfo.update({
          action: 'update',
          contactId: contactInfo.contactId
        }, contactInfo).$promise;
      };
    // ============= END Contact Info Service =============

    // ============= User Address Service =============
      var states = [
        {
          'name': 'Alabama',
          'abbreviation': 'AL'
        },
        {
          'name': 'Alaska',
          'abbreviation': 'AK'
        },
        {
          'name': 'American Samoa',
          'abbreviation': 'AS'
        },
        {
          'name': 'Arizona',
          'abbreviation': 'AZ'
        },
        {
          'name': 'Arkansas',
          'abbreviation': 'AR'
        },
        {
          'name': 'California',
          'abbreviation': 'CA'
        },
        {
          'name': 'Colorado',
          'abbreviation': 'CO'
        },
        {
          'name': 'Connecticut',
          'abbreviation': 'CT'
        },
        {
          'name': 'Delaware',
          'abbreviation': 'DE'
        },
        {
          'name': 'District Of Columbia',
          'abbreviation': 'DC'
        },
        {
          'name': 'Federated States Of Micronesia',
          'abbreviation': 'FM'
        },
        {
          'name': 'Florida',
          'abbreviation': 'FL'
        },
        {
          'name': 'Georgia',
          'abbreviation': 'GA'
        },
        {
          'name': 'Guam',
          'abbreviation': 'GU'
        },
        {
          'name': 'Hawaii',
          'abbreviation': 'HI'
        },
        {
          'name': 'Idaho',
          'abbreviation': 'ID'
        },
        {
          'name': 'Illinois',
          'abbreviation': 'IL'
        },
        {
          'name': 'Indiana',
          'abbreviation': 'IN'
        },
        {
          'name': 'Iowa',
          'abbreviation': 'IA'
        },
        {
          'name': 'Kansas',
          'abbreviation': 'KS'
        },
        {
          'name': 'Kentucky',
          'abbreviation': 'KY'
        },
        {
          'name': 'Louisiana',
          'abbreviation': 'LA'
        },
        {
          'name': 'Maine',
          'abbreviation': 'ME'
        },
        {
          'name': 'Marshall Islands',
          'abbreviation': 'MH'
        },
        {
          'name': 'Maryland',
          'abbreviation': 'MD'
        },
        {
          'name': 'Massachusetts',
          'abbreviation': 'MA'
        },
        {
          'name': 'Michigan',
          'abbreviation': 'MI'
        },
        {
          'name': 'Minnesota',
          'abbreviation': 'MN'
        },
        {
          'name': 'Mississippi',
          'abbreviation': 'MS'
        },
        {
          'name': 'Missouri',
          'abbreviation': 'MO'
        },
        {
          'name': 'Montana',
          'abbreviation': 'MT'
        },
        {
          'name': 'Nebraska',
          'abbreviation': 'NE'
        },
        {
          'name': 'Nevada',
          'abbreviation': 'NV'
        },
        {
          'name': 'New Hampshire',
          'abbreviation': 'NH'
        },
        {
          'name': 'New Jersey',
          'abbreviation': 'NJ'
        },
        {
          'name': 'New Mexico',
          'abbreviation': 'NM'
        },
        {
          'name': 'New York',
          'abbreviation': 'NY'
        },
        {
          'name': 'North Carolina',
          'abbreviation': 'NC'
        },
        {
          'name': 'North Dakota',
          'abbreviation': 'ND'
        },
        {
          'name': 'Northern Mariana Islands',
          'abbreviation': 'MP'
        },
        {
          'name': 'Ohio',
          'abbreviation': 'OH'
        },
        {
          'name': 'Oklahoma',
          'abbreviation': 'OK'
        },
        {
          'name': 'Oregon',
          'abbreviation': 'OR'
        },
        {
          'name': 'Palau',
          'abbreviation': 'PW'
        },
        {
          'name': 'Pennsylvania',
          'abbreviation': 'PA'
        },
        {
          'name': 'Puerto Rico',
          'abbreviation': 'PR'
        },
        {
          'name': 'Rhode Island',
          'abbreviation': 'RI'
        },
        {
          'name': 'South Carolina',
          'abbreviation': 'SC'
        },
        {
          'name': 'South Dakota',
          'abbreviation': 'SD'
        },
        {
          'name': 'Tennessee',
          'abbreviation': 'TN'
        },
        {
          'name': 'Texas',
          'abbreviation': 'TX'
        },
        {
          'name': 'Utah',
          'abbreviation': 'UT'
        },
        {
          'name': 'Vermont',
          'abbreviation': 'VT'
        },
        {
          'name': 'Virgin Islands',
          'abbreviation': 'VI'
        },
        {
          'name': 'Virginia',
          'abbreviation': 'VA'
        },
        {
          'name': 'Washington',
          'abbreviation': 'WA'
        },
        {
          'name': 'West Virginia',
          'abbreviation': 'WV'
        },
        {
          'name': 'Wisconsin',
          'abbreviation': 'WI'
        },
        {
          'name': 'Wyoming',
          'abbreviation': 'WY'
        }
      ];

      this.getStates = function () {
        return states;
      };

      this.getState = function (stateAbbreviation) {
        var state = null;
        angular.forEach(states, function (iterState) {
          if (iterState.abbreviation === stateAbbreviation) {
            state = iterState;
            return;
          }
        });
        return state;
      };

      var UserAddress = $resource('/api/v1/user/address/:action/:userId/:addressId',{
        addressId: ''
      },{
        post: { method:'POST', isArray: true },
        update: { method:'PUT' }
      });

      this.createAddress = function (address) {
        return UserAddress.save({action: 'create'}, address).$promise;
      };

      this.listAddresses = function (addressId) {
        return UserAddress.post({
          action: 'list',
          addressId: addressId
        }, {}).$promise;
      };

      this.getAddress = function (userId, addressId) {
        return UserAddress.get({
          action: 'load',
          userId: userId,
          addressId: addressId
        }).$promise;
      };

      this.updateAddress = function (addressId, address, userId) {
        return UserAddress.update({
          action: 'update',
          addressId: addressId,
          userId: userId
        }, address).$promise;
      };

      this.deleteAddress = function (addressId) {
        return UserAddress.delete({
          action: 'delete',
          addressId: addressId
        }).$promise;
      };
    // ============= END User Address Service =============

    // ============= User Relation Service =============
      var UserRelation = $resource('/api/v1/user/relation/:action/:userId/:relationId',{
        relationId: ''
      },{});

      this.createRelation = function (parentId, childId, type) {
        return UserRelation.save({action: 'create'},{
          sourceUserId: parentId,
          targetUserId: childId,
          type: type
        }).$promise;
      };

      this.listRelations = function (userId) {
        return UserRelation.query({
          action: 'list',
          userId: userId
        }).$promise;
      };
    // ============= END User Relation Service =============
    });
