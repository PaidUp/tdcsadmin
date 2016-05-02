angular.module('convenienceApp')
  .controller('ScheduleV3Ctrl', function ($scope, $rootScope, scheduleService, FlashService, CommerceService,
                                        PaymentService, $q) {

    $rootScope.$emit('bar-welcome', {
      left:{
        url: '/app/application/menu/admin/admin-bar.html'
      } ,
      right:{
        url: ''
      }
    });

    $scope.searchCriteria = '';
    $scope.scheduleNew = {isCharged : false};
    $scope.accounts = [];
    $scope.submitted = false;
    $scope.orderPreview = 0;
    $scope.orderSelected = null;
    $scope.searchResult = [];

    function parceDatePaymentPlan(order){
      var paymentPlans = order.paymentsPlan.map(function(pp){
        pp.dateCharge = new Date(pp.dateCharge);
        return pp;
      });
      order.paymentPlans = paymentPlans;
      return order;
    }

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    $scope.setPreview = function(index){
      if($scope.orderPreview == index){
        $scope.orderPreview = null;
      } else {
        $scope.orderPreview = index;
      }

    }

    $scope.search = function(searchCriteria) {
      $scope.submitted = true;
      $scope.accounts = [];
      $scope.orderSelected = null;

      CommerceService.orderSearch(searchCriteria).then(function(result){
        console.log(result)
        $scope.searchResult = result.body;
        $scope.submitted = false;
      }).catch(function(err){
        $scope.sendAlertErrorMsg(JSON.stringify(err))
        $scope.submitted = false;
      });


    }

    $scope.selectOrder = function(index){
      $scope.orderSelected = parceDatePaymentPlan($scope.searchResult.orders[index]);
      loadAccounts($scope.orderSelected);
    }

    $scope.editPaymentPlan = function(pp){
      console.log('PP: ' , pp._id)
      if(!$scope.orderSelected._id || !pp.originalPrice || !pp.description || !pp.dateCharge){
        FlashService.addAlert({
          type: "danger",
          msg: "All params are required",
          timeout: 10000
        });
        return;
      }



      var params = {
        orderId : $scope.orderSelected._id,
        paymentPlanId: pp._id,
        originalPrice: pp.originalPrice,
        description: pp.description,
        dateCharge: pp.dateCharge,
        wasProcessed: pp.wasProcessed,
        account: pp.account,
        accountBrand: pp.accountBrand,
        last4: pp.last4,
        typeAccount: pp.typeAccount
      }

      $scope.submitted = true;

      CommerceService.paymentPlanEdit(params).then(function(res){
        $scope.orderSelected = parceDatePaymentPlan(res);
        FlashService.addAlert({
          type: "success",
          msg: "change was success.",
          timeout: 10000
        });
        $scope.submitted = false;
      }).catch(function(err){
        console.log("ERR: ", err );

      });
    }

    $scope.changeAccount = function(pp){
      var objAccount = $scope.accounts.filter(function(ele){
        if(pp.account === ele.id){
          return ele;
        }
      });

      if(!objAccount || objAccount.length < 1){
        FlashService.addAlert({
          type: "danger",
          msg: "Credit card is required.",
          timeout: 10000
        });
        return;
      }

      pp.account = objAccount[0].id;
      pp.accountBrand = objAccount[0].brand;
      pp.last4 = objAccount[0].last4;
      pp.typeAccount = objAccount[0].object;

      $scope.editPaymentPlan(pp);
    };

    $scope.close = function(){
      $scope.orderSelected = null;
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
    };

    function loadAccounts(order){
      loadBankAccounts(order.userId, $scope.accounts).then(function(lst){
        loadCreditCardAccounts(order.userId, lst).then(function(lst2){
          //$scope.accounts.push({ accountName: 'Create a new credit card' });
          //$scope.accounts.push({ accountName : 'Create a new bank account' , last4: '' });


          console.log('lst accounts' , lst2);

        }, function(err2){
          $scope.sendAlertErrorMsg(err.data.message);
        });
      }, function(err){
        $scope.sendAlertErrorMsg(err.data.message);
      });
    }


  });
