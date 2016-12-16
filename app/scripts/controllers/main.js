function MainCtrl($scope,$state,srvcCom) {
//  $scope.awesomeThings = [
//    'HTML5 Boilerplate',
//    'AngularJS',
//    'Karma'
//  ];
  var objCurr = {};
  $scope.comment = function(strImagePath,strName){
    objCurr.name = strName;
    objCurr.url = strImagePath;
    srvcCom.setObj(objCurr);
    $state.go('about');
  };
};
MainCtrl.$inject = ['$scope','$state','srvcCom'];
entApp.controller('MainCtrl',MainCtrl);
