angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
        
      
    
      
        
    .state('vehicles', {
      url: '/vehicles',
      templateUrl: 'templates/vehicles.html',
      controller: 'vehiclesCtrl'
    })
    
    .state('vehicledetail', {
      url: '/vehicledetail',
      templateUrl: 'templates/vehicledetail.html',
      controller: 'vehicledetailCtrl'
    })
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});