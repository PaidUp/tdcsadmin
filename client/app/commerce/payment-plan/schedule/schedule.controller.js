angular.module('convenienceApp')
  .controller('ScheduleCtrl', function ($scope, $rootScope, scheduleService, FlashService, CommerceService,
                                        PaymentService, $q) {

    $rootScope.$emit('bar-welcome', {
      left:{
        url: '/app/application/menu/admin/admin-bar.html'
      } ,
      right:{
        url: ''
      }
    });

    $scope.orderId = '';
    $scope.scheduleNew = {isCharged : false};
    $scope.accounts = [];

    $scope.search = function(orderId){
      $scope.submitted = true;
      $scope.accounts = [];
      $scope.paymentPlan = {};
      $scope.order = {};


      CommerceService.getOrderBasic(orderId).then(function(order){

        $scope.order = order;
        search(order);
      }).catch(function(err){
        $scope.submitted = false;
        FlashService.addAlert({
          type: "danger",
          msg: "Can't be searched the order schedule, please contact us.",
          timeout: 10000
        });
      });
    }

    $scope.updatePeriod = function(orderId, period){
      $scope.submitted = true;
      if(validatePeriod(period)){
        scheduleService.scheduleInformationUpdate(period).then(function(resp){
          FlashService.addAlert({
            type: resp.data ? "success": "danger",
            msg: resp.data ? "Schedule period was updated success. " : "Schedule period wasn't be update. ",
            timeout: 10000
          });
          $scope.search(orderId);
        }).catch(function(err){
          $scope.submitted = false;
          FlashService.addAlert({
            type: "danger",
            msg: "Schedule period wasn't be update.",
            timeout: 10000
          });
        });
      }
    }

    $scope.deactivatePeriod = function(orderId, period){
      period.status = "deactivate"
      period.isCharged = true
      $scope.updatePeriod(orderId, period);
    }

    $scope.activatePeriod = function(orderId, period){
      period.status = "activate"
      $scope.updatePeriod(orderId, period);
    }

    $scope.createPeriod = function(orderId, paymentPlanId, newPeriod){
      if(validatePeriod(newPeriod)){
        newPeriod.paymentPlanId = paymentPlanId
        $scope.submitted = true;
        scheduleService.scheduleInformationCreate(newPeriod).then(function(resp){
          FlashService.addAlert({
            type: resp.data ? "success": "danger",
            msg: resp.data ? "Schedule period was created success. " : "Schedule period wasn't be created. ",
            timeout: 10000
          });
          $scope.search(orderId);
        }).catch(function(err){
          $scope.submitted = false;
          FlashService.addAlert({
            type: "danger",
            msg: "Schedule period wasn't be create.",
            timeout: 10000
          });
        });
      }
    }

    $scope.clearNewPeriod = function(){
      $scope.scheduleNew = {isCharged : false};
    }

    $scope.getStatusName = function(isCharged, status){
      return scheduleService.getStatusPeriod(isCharged, status);
    }

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    function search(order) {
      $scope.submitted = true;
      $scope.accounts = [];
      $scope.clearNewPeriod();
      scheduleService.scheduleInfoFull(order.incrementId).then(function(data){
        if(!data || !data.paymentList || !data.paymentList.schedulePeriods){
          FlashService.addAlert({
            type: "warning",
            msg: "Can't be load this order.",
            timeout: 10000
          });
          $scope.submitted = false;
          $scope.paymentPlan = {};
        }else{

          loadBankAccounts(order.userId, $scope.accounts).then(function(lst){
            loadCreditCardAccounts(order.userId, lst).then(function(lst2){
              //$scope.accounts.push({ accountName: 'Create a new credit card' });
              //$scope.accounts.push({ accountName : 'Create a new bank account' , last4: '' });


              data.paymentList.schedulePeriods.forEach(function(ele , idx ,arr){
                ele.nextPaymentDue = new Date(ele.nextPaymentDue)
                ele.price = parseFloat(ele.price)
                ele.percent = parseFloat(ele.percent)
                ele.fee = parseFloat(ele.fee)
                ele.feePercent = parseFloat(ele.feePercent)
                ele.discountToFee = parseFloat(ele.discountToFee)
                ele.isCharged = ele.isCharged ? ele.isCharged : false;
              });

              $scope.paymentPlan = data.paymentList;

              $scope.submitted = false;

            }, function(err2){
              $scope.sendAlertErrorMsg(err.data.message);
            });
          }, function(err){
            $scope.sendAlertErrorMsg(err.data.message);
          });

        }
      }).catch(function(err){
        $scope.accounts = [];
        $scope.paymentPlan = {};
        $scope.order = {};
        FlashService.addAlert({
          type: "danger",
          msg: "Can't be searched the order schedule, please contact us.",
          timeout: 10000
        });
      });
    }

    function validatePeriod(period){
      var resp = true;

      if(!period.price){
        resp = false;
      }
      else if(!period.nextPaymentDue){
        resp = false;
      }
      else if(!period.description){
        resp = false;
      }
      else if(!period.accountId){
        resp = false;
      }

      if(!resp){
        FlashService.addAlert({
          type: "danger",
          msg: "All fields are required.",
          timeout: 10000
        });
        $scope.submitted = false;
      }

      return resp;

    }

    function loadBankAccounts(userId, lstAccount){
      return $q(function(resolve, reject){
        setTimeout(function(){
          PaymentService.listBankAccounts(userId).then(function (response) {
            response.data.forEach(function(ele, idx, arr){
              ele.accountName = ele.bankName + ' ending in ';
              lstAccount.push(ele)
            });
            resolve(lstAccount);
          }).catch(function (err) {
            reject(err.data.message);
          });
        }, 1000);
      });
    };

    function loadCreditCardAccounts(userId, lstAccount){
      return $q(function(resolve, reject){
        setTimeout(function(){
          PaymentService.listCards(userId).then(function (response) {
            response.data.forEach(function(card, idx, arr){
              card.nameOnCard = card.name;
              card.cardNumber = card.last4;
              card.expirationDate = {};
              card.expirationDate.month = card.expirationMonth;
              card.expirationDate.year = card.expirationYear;
              card.securityCode = card.cvv;
              card.token = card.id;
              card.accountName = card.brand + ' ending in ';
              lstAccount.push(card)
            });
            resolve(lstAccount);
          }).catch(function (err) {
            reject(err.data.message)
          });

        }, 1000);
      });
    }


  });
