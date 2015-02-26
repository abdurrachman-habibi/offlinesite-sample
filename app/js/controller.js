(function(){
    var app = angular.module('app');

    app.controller('HomeCtrl', HomeCtrl);
    HomeCtrl.$inject = ['$location', '$mdDialog', '$scope', 'Item'];
    function HomeCtrl($location, $mdDialog, $scope, Item){
        $scope.items = Item.queryLocal();

        Item.query().then(function(data){
            if (data) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('New Data')
                        .content('New data is available. Page will be refreshed')
                        .ok('Ok')
                ).then(function () {
                        $scope.items = data;
                    });
            }
        }, function(status){
            if (status == 401) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('Login is required')
                        .content('New data can only be checked once you logged in')
                        .ok('Ok')
                ).then(function () {
                        $location.path('/login');
                    });
            }
        })
    }

    app.controller('AccountCtrl', AccountCtrl);
    AccountCtrl.$inject = ['$location', '$mdDialog', '$scope', 'Auth'];
    function AccountCtrl($location, $mdDialog, $scope, Auth) {

        $scope.loginData = {
            username: '',
            password: ''
        };

        function login() {
            Auth.login($scope.loginData).then(function () {
                $location.path('/');
            }, function () {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('Error Login')
                        .content('Connection Problem or Invalid Login Data. Please try again')
                        .ok('Ok')
                );
            });
        }

        $scope.login = login;
    }
})();