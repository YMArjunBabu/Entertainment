'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('entApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope,$state) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
//  it('should got to the other page', function () {
//    spyOn(MainCtrl, 'comment');
//    expect(scope.comment).toHaveBeenCalled();
//
//  });
});
