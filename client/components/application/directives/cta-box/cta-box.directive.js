'use strict';

angular.module('convenienceApp')
  .controller('CtaBoxController', ['$scope','ContactService','ModalService', 'ModalFactory', 'FlashService', 'TrackerService', 
    function($scope, ContactService,ModalService, ModalFactory, FlashService, TrackerService) {
      $scope.modalFactory = ModalFactory;
      $scope.modal = ModalService;

      if($scope.subject){
        console.log('subject' , $scope.subject);
        $scope.contactInfo = {subject : $scope.subject};
      }

    $scope.contactUs = function (form, contactInfo) {
      $scope.submitted = true;
      if (form.$valid) {

        contactInfo.subject = 'CTA BOX'

        contactInfo.content = 'Name: '+contactInfo.name+ ' | Phone: '+contactInfo.phone;
        TrackerService.pageTrack(contactInfo);
        ContactService.contactUs(contactInfo);
        $scope.contactInfo = {};
        $scope.submitted = false;

        FlashService.addAlert({
          type: 'success',
          msg: 'Thanks.  Allan will contact you shortly.',
          timeout: 10000
        });

      }
    };
}]).directive('ctaBox', function () {
    return {
      templateUrl: 'components/application/directives/cta-box/cta-box.html',
      restrict: 'E',
      controller: 'CtaBoxController',
      scope: {
        subject: "@subject"
      }
    };
  });
