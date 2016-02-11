'use strict';

angular.module('convenienceApp')
  .service('ApplicationConfigService', function ($cookieStore, $resource) {
    var Config = $resource('/api/v1/application/config', {}, {});

    this.getConfig = function () {
      return Config.get().$promise;
    };
  });