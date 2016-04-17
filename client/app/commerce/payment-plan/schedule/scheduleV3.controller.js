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
      $scope.orderSelected = searchResult[index];
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


  });
