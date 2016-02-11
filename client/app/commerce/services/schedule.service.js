'use strict';

angular.module('convenienceApp')
  .service('scheduleService', function ($cookieStore, $q, $resource, $rootScope) {
    var ScheduleInfo = $resource('/api/v1/commerce/schedule/info/:action/:orderId', {}, {});
    var Schedule = $resource('/api/v1/commerce/schedule/:action', {}, {});

    var informationUpdate = $resource('/api/v1/commerce/schedule/information/update', {}, {});
    var informationCreate = $resource('/api/v1/commerce/schedule/information/create', {}, {});

    this.scheduleList = function(scheduleFilter){
      return Schedule.save({action: 'list'},scheduleFilter).$promise;
    };

    this.scheduleInfoFull = function(orderId){
        return ScheduleInfo.get({action: 'full',orderId: orderId}).$promise;
    };

    this.scheduleInformationUpdate = function(params){
      return informationUpdate.save(params).$promise;
    };

    this.scheduleInformationCreate = function(params){
      return informationCreate.save(params).$promise;
    };

    this.getStatusPeriod = function(isCharged, status){
      if(!status || !isCharged){
        return "Pending";
      }

      var result = "";
      switch (status) {
        case "succeeded":
          result = "Paid";
          break;
        case "failed":
          result = "Failed";
          break;
        case "pending":
          result = "Pending (ACH)";
          break;
        case "deactivate":
          result = "Removed";
          break;
        case "activate":
          result = "Pending";
          break;
        default:
          result = status;
      }
      return result;
    }

  });
