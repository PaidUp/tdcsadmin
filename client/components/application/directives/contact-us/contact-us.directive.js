'use strict';

angular.module('convenienceApp')
  .controller('ContactUsController', ['$scope','ContactService','ModalService', 'ModalFactory',
    function($scope, ContactService,ModalService, ModalFactory) {
      $scope.modalFactory = ModalFactory;
      $scope.modal = ModalService;

      if($scope.subject){
        console.log('subject' , $scope.subject);
        $scope.contactInfo = {subject : $scope.subject};
      }

    $scope.contactUs = function (form, contactInfo) {
      $scope.submitted = true;
      if (form.$valid) {
        ContactService.contactUs(contactInfo);
        $scope.contactInfo = {};
        $scope.submitted = false;
        $scope.modalFactory.closeModal();
        $scope.modalFactory.ContactUsModalConfirmation();

      }
    };
}]).directive('contactUs', function () {
    return {
      templateUrl: 'components/application/directives/contact-us/contact-us.html',
      restrict: 'E',
      controller: 'ContactUsController',
      scope: {
        subject: "@subject"
      }
    };
  });
