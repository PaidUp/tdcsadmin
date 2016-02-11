'use strict';

angular.module('convenienceApp')
  .controller('CtaModalController', ['$scope','ContactService', 'ModalFactory', 'FlashService', '$cookieStore',
    function($scope, ContactService, ModalFactory, FlashService, $cookieStore) {

      $scope.content = {
        faq : {
          header : "I hope you found our FAQ's helpful!",
          body : 'Do you want a case study from a real life volleyball club director and happy ' +
          'client of Convenience Select?  &nbsp;&nbsp;&nbsp;Enter you details below.',
          button : 'More Details Please',
          subject : 'CTA - FAQ'
        },
        demos : {
          header : 'I hope you found our video demos helpful!',
          body : "Hello, my name is Allan Rayson, CEO of Convenience Select, and I am excited that you have taken an " +
          "interest in the three pillars of Convenience Select.  &nbsp;&nbsp;&nbsp;Let me know if you would like to talk.",
          button : 'Contact Me',
          subject : 'CTA - DEMOS'
        }
      }


      $scope.closeModal = function(){
        ModalFactory.closeModal();
        ContactService.ctaModalCloseFlag = true;
      }

      if($scope.page){
        $scope.contactInfo = {subject : $scope.content[$scope.page].subject};
      }else{
        $scope.contactInfo = {subject : 'CTA without subject'};
      }

    $scope.contactUs = function (form, contactInfo) {
      $scope.submitted = true;
      if (form.$valid) {

        var name = contactInfo.name || ' ';
        var phone = contactInfo.phone || ' ';


        contactInfo.content = 'Name: '+name+ ' | Phone: '+phone;

        ContactService.contactUs(contactInfo);
        $scope.contactInfo = {};
        $scope.submitted = false;

        $cookieStore.put(ContactService.ctaModalFlag , true);

        FlashService.addAlert({
          type: 'success',
          msg: 'Thanks.  Allan will contact you shortly.',
          timeout: 10000
        });

        ModalFactory.closeModal();
      }
    };
}]).directive('ctaModal', function () {
    return {
      templateUrl: 'components/application/directives/cta-modal/cta-modal.html',
      restrict: 'E',
      controller: 'CtaModalController',
      scope: {
        page: "@page"
      }
    };
  });
