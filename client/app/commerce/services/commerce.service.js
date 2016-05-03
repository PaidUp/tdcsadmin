'use strict';

angular.module('convenienceApp')
  .service('CommerceService', function ($cookieStore, $resource, $q, $rootScope) {
    var Orders = $resource('/api/v1/commerce/order/list', {}, {});
    var Order = $resource('/api/v1/commerce/order/:orderId', {}, {});
    var OrderBasic = $resource('/api/v1/commerce/order/basic/:orderId', {}, {});
    var Transactions = $resource('/api/v1/commerce/transaction/list', {}, {});
    var Provider = $resource('/api/v1/commerce/provider/request', {}, {});
    var Schedule = $resource('/api/v1/commerce/schedule/generate', {}, {
      post: { method:'POST', isArray: false }});

    var OrderSearch = $resource('/api/v1/commerce/order/search', {}, {
      post: { method:'POST', isArray: false }});

    var PaymentPlanEdit = $resource('/api/v1/commerce/order/edit', {}, {
      post: { method:'POST', isArray: false }});

    var PaymentPlanAdd = $resource('/api/v1/commerce/order/add', {}, {
      post: { method:'POST', isArray: false }});


    this.getOrders = function () {
      return Orders.query().$promise;
    };

    this.getOrder = function (orderId) {
      return Order.get({orderId:orderId}).$promise;
    };

    this.orderSearch = function (params) {
      return OrderSearch.post({params:params}).$promise;
    };

    this.paymentPlanEdit = function (params) {
      return PaymentPlanEdit.post(params).$promise;
    };

    this.paymentPlanAdd = function (params) {
      return PaymentPlanAdd.post(params).$promise;
    };

    this.getOrderBasic = function (orderId) {
      return OrderBasic.get({orderId:orderId}).$promise;
    };

    this.getUsertransactions = function () {
      return Transactions.query().$promise;
    };

    this.getSchedule = function(productId, price, isInFullPay, discount){
      return Schedule.post({productId: productId, price : price, isInFullPay: isInFullPay, discount:discount}).$promise;
    };
  });
