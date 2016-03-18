;(function(angular){
    angular.module('Modal',[])
    .directive('modal', function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {
                show: '=',
                onclose: '&',
                onopen: '&'
            },
            transclude: true,
            link: function(scope, element, attrs) {
                var $element = $(element),
                    $modal = $element.find('.modal');
                scope.dialogStyle = {width: '400px', height: '60%'};
                scope.show = false;

                if (attrs.width){
                  scope.dialogStyle.width = attrs.width;
                } if (attrs.height){
                  scope.dialogStyle.height = attrs.height;
                }

                scope.$watch('show', function(value){
                    if (value === true){
                        scope.showModal();
                    }else{
                        scope.hideModal();
                    }
                });

                scope.showModal = function(){
                    $element.fadeIn();
                    angular.element(document.body).css('overflow','hidden');
                    scope.onopen();
                };

                scope.hideModal = function() {
                    $element.fadeOut(function(){
                        angular.element(document.body).css('overflow','auto');
                    });
                    scope.show = false;
                    scope.onclose();
                };
              },
              template: "<div class='dialog'><div class='overlay' ng-click='hideModal()'></div><div class='modal' ng-style='dialogStyle'><div class='fa fa-times' ng-click='hideModal()'></div><div class='content' ng-transclude></div></div></div>"
        };
    });
})(angular);
