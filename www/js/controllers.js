angular.module('app.controllers', ['ionic', 'app.services', 'ui.router'])
  
.controller('loginCtrl', function($scope, $http, $localstorage, $state) {
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	
  $scope.validateLogin = function(v_credentials) {
      v_username = v_credentials.username;
      v_password = v_credentials.password;
      myobject = { x_username:v_username, x_password:v_password };        
        Object.toparams = function ObjecttoParams(obj) 
        {
          var p = [];
          for (var key in obj) 
          {
            p.push(key + '=' + encodeURIComponent(obj[key]));
          }
          return p.join('&');
        };

        var req = 
        {
            method: 'POST',
            url: "http://demo.remotehourmeter.com/crmlogin",
            data: Object.toparams(myobject),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
        $http(req).
        success(function(data, status, headers, config) {
            if (data.login_result === "1") {
                v_app_key = data.app_key;
                $localstorage.set('app_key', v_app_key);
                console.log("Login successful");
                $state.go('vehicles', {}, {reload: true, inherit: false});
                return true;
            }
        }).
        error(function(data, status, headers, config) {
        });
  }
})
   
.controller('vehiclesCtrl', function($scope, $http, $localstorage, $timeout, $state) {
	
    $scope.init = function(){
        console.log("Initializing the vehicles page");
		v_guid = $localstorage.get('app_key');
        $scope.vehicles = [];
        $scope.addvehicle = function(x_vehiclename, x_record_id) {
            $scope.vehicles.push({vehicle_name: x_vehiclename, record_id: x_record_id});
        }
        v_req =
        {
            method: 'GET',
            url: "http://demo.remotehourmeter.com/crm/vehiclelist/" + v_guid
        }
        $http(v_req).
        success(function(data, status, headers, config) {
            angular.forEach(data, function(value, key) {
                console.log(value + ":" + key);
                v_count = 0;
                v_pushdata = [];
                angular.forEach(value, function(value2, key2) {
                    v_count ++;
                    v_pushdata[v_count] = value2;
                });
                if (v_count > 0) {
                    $scope.addvehicle(v_pushdata[1], v_pushdata[2]);
                }
            });
        })
        .error(function(data, status, headers,config) {
        });
    }

    $timeout($scope.init);
    
    $scope.getVehicleDetail = function(x_record_id) {
        $localstorage.set('vehicle_record_id', x_record_id);
        $state.go('vehicledetail');
    }
})

.controller('vehicledetailCtrl', function($scope, $http, $localstorage, $timeout, $state) {
    $scope.init = function(){
        v_record_id = $localstorage.get('vehicle_record_id');
        v_guid = $localstorage.get('app_key');
        console.log("Getting record info for thing id " + v_record_id);
        $scope.vehicledetail = [];
        $scope.rentaldetail = [];
        
         v_req =
        {
            method: 'GET',
            url: "http://demo.remotehourmeter.com/crm/vehicledetail/" + v_guid + "/" + v_record_id
        }
        v_index = 0;
        $scope.v_rentaldone = 0;
        $http(v_req).
        success(function(data, status, headers, config) {
            angular.forEach(data, function(value, key) {
                if (key === 'Operational')
                    v_index = 1;
                if (key === 'Rental')
                    v_index = 2;
                if ((key != 'Record ID') && (key != 'Operational') && (key != 'Rental')) {
                     if (v_index === 1)
                        $scope.vehicledetail.push({keyfield:key, valuefield:value});
                     else {
//                         if ($scope.v_rentaldone === 0)
//                             $scope.rentaldetail.push({keyfield:'<h2>Rental information</h2>', valuefield:''});
                         $scope.v_rentaldone = 1;
                         $scope.rentaldetail.push({keyfield:key, valuefield:value});
                    }
                 }
            })
            console.log($scope.v_rentaldone);
        })
        .error(function(data, status, headers,config) {
        });    
    }

    $timeout($scope.init);
})
 