'use strict';

describe('Controller: WelcomeBarCtrl', function () {

  // load the directive's module and view
  beforeEach(module('convenienceApp'));

  // var element, scope;
  var rootScope;
  var scope;
  var WelcomeBarCtrl;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  describe("Listen welcome bar broadcasts", function() {
    var welcomeBar = {
        left: { url: 'panel' },
        right: { url: 'other-panel' },
        data: [
            {
                url: 'url1',
                desc: 'desc'
            }
        ]
    };
    beforeEach(inject(function($rootScope, $controller) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        WelcomeBarCtrl = $controller('WelcomeBarCtrl', {$scope: scope});
    }));

    it("should listen bar-welcome broadcast events", function() {
        rootScope.$broadcast('bar-welcome', welcomeBar);
        expect(scope.breadcrums).toEqual(welcomeBar.data);
        expect(scope.leftBar).toEqual(welcomeBar.left.url);
        expect(scope.rightBar).toEqual(welcomeBar.right.url);
    });
  });
});