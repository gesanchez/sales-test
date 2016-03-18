;(function(angular){
  angular.module('Json',[])
  .directive('json', function(){
    return {
      restrict: 'A',
      scope:{
        callback: '&'
      },
      link: function(scope, element, attr){
        var text = element.text();
        element.text('');
        if (scope.callback){
          scope.callback({data: angular.fromJson(text)});
        }
      }
    }
  })
})(angular);
