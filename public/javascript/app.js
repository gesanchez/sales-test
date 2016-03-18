;(function(angular){

  angular.module('SalesApp', ['ngRoute', 'Json', 'Modal', 'ngStorage'])
  .config(['$routeProvider','$httpProvider', '$localStorageProvider',function($routeProvider, $httpProvider, $localStorageProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/static/templates/index.html',
        controller: 'IndexCtrl'
      }).
      when('/cart', {
        templateUrl: '/static/templates/shopping-cart.html',
        controller: 'CartCtrl'
      }).
      when('/billing', {
        templateUrl: '/static/templates/billing.html',
        controller: 'BillingCtrl'
      }).
      when('/my-shops', {
        templateUrl: '/static/templates/my-shop.html',
        controller: 'ShopsCtlr'
      }).
      otherwise({
        redirectTo: '/'
      });

      $httpProvider.defaults.headers.common = {
        'x-access-token': $localStorageProvider.$get().token
      };
  }])
  .factory('ProductsService', ['$http', '$location', function($http, $location){
    return{
      places: [],
      data : [],
      shops: [],
      myList : [],
      checkout: function(){
        var self = this;
        return $http({
          method: 'POST',
          url: '/api/checkout',
          data: $.param({items: self.myList}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
          alert(data.message);
          $location.path('/');
          self.myList = [];
        })
      },
      update: function(id, data){
        return $http({
          method: 'PUT',
          url: '/api/product/' + id,
          data: $.param(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
          alert('Product update successfully');
        })
      },
      initProducts: function(){
        var self = this;
        return $http.get('/api/my-shops').success(function(data){
          self.shops = data;
        });
      }
    };
  }])
  .factory('AuthService', ['$http', '$localStorage', function($http, $localStorage){
    return{
      states: {error: ''},
      login : function(documents){
        var self = this;
        self.states.error = '';
        return $http({
          method: 'POST',
          url: '/api/login',
          data: $.param({'document': documents}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
          $localStorage.token = data.token;
          $localStorage.user = data.user;
        }).error(function(data){
          if (angular.isObject(data)){
            if (data.success === false){
              self.states.error = data.message;
            }
          }
        })
      }
    };
  }])
  .factory('BillService', ['$http', function($http){
    return {
      data: null,
      search: function(query){
        var self = this;
        $http.get('/api/billing/' + query).success(function(data){
          self.data = data;
        });
      }
    };
  }])
  .controller('MainCtrl',['$scope', 'ProductsService', 'AuthService', '$localStorage', '$location', function($scope, ProductsService, AuthService, $localStorage, $location){
    $scope.loginFields = {};
    $scope.storage = $localStorage;
    $scope.productsService = ProductsService;
    $scope.statesLogin = AuthService.states;
    $scope.loginModal = false;
    $scope.init = function(data){
      ProductsService.data = data.products;
      ProductsService.places = data.places;
    };
    $scope.doLogin = function(){
      AuthService.login($scope.loginFields.documents).success(function(){
        $scope.loginModal = false;
      });
    };
    $scope.goTo = function(path){
      $location.path(path);
    };
    $scope.logout = function(){
      $localStorage.$reset();
    };
  }])
  .controller('IndexCtrl', ['$scope', 'ProductsService', function($scope, ProductsService){
    $scope.products = ProductsService.data;
    $scope.addCart = function(item){
      ProductsService.myList.push(item);
      alert('Item added to cart');
    };
  }])
  .controller('CartCtrl', ['$scope', 'ProductsService', function($scope, ProductsService){
    $scope.products = ProductsService;
    $scope.checkout = function(){
      ProductsService.checkout();
    };
  }])
  .controller('ShopsCtlr', ['$scope', 'ProductsService', function($scope, ProductsService){
    $scope.products = ProductsService;
    $scope.update = function(e, item){
      e.preventDefault();
      ProductsService.update(item.id, {price: item.price || item.product.price});
    };

    ProductsService.initProducts();
  }])
  .controller('BillingCtrl', ['$scope', 'BillService', function($scope, BillService){
    $scope.bill = BillService;
    $scope.queryFields = {};
    $scope.totalPrice = 0;
    $scope.search = function(){
      BillService.search($scope.queryFields.query);
    };

    $scope.$watch('bill.data',function(value){
      if (value){
        angular.forEach(value.items, function(item){
          if (item.hasOwnProperty('price')){
            console.log(item.price);
            $scope.totalPrice += parseFloat(item.price || 0);
          }
        });
      }
    },true)
  }]);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['SalesApp']);
  });

})(angular);
