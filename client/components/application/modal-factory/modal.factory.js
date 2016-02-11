'use strict';

angular.module('convenienceApp')
  .factory('ModalFactory', function ($rootScope, $modal) {

    var openModal = function (options) {
      $rootScope.modal = $modal.open(options);
    };
    return {
      PrivacyModal: function () {
        openModal({
          templateUrl: 'app/application/privacy-policy/privacy-modal.html',
          controller: 'PrivacyCtrl',
          size: 'lg'
        });
      },
      closeModal: function () {
        $rootScope.modal.dismiss('cancel');
      }
    };
  });

angular.module('convenienceApp')
  .factory('ModalParams', function () {
    return {};
  });
