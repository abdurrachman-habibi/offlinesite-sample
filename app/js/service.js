(function() {
    var app = angular.module('app');
    var serviceBaseUri = 'http://mydemo-api.azurewebsites.net/';

    app.factory('Item', Item);
    Item.$inject = ['$http', '$q', 'localStorageService'];
    function Item($http, $q, localStorageService){
        var items;
        function getLocalStorage() {
            return localStorageService.get('Item');
        }

        function setLocalStorage(data) {
            localStorageService.set('Item', data);
        }

        function queryLocal() {
            return getLocalStorage();
        }

        function query() {
            function saveLocal(response) {
                var data = response;
                var dataString = JSON.stringify(data);

                var localItems = getLocalStorage();

                if (!localItems || dataString != JSON.stringify(localItems)) {
                    setLocalStorage(data);
                    return true;
                }
                else {
                    return false;
                }
            }

            var deferred = $q.defer();

            if (items) {
                deferred.resolve();
            }
            else {
                var apiUrl = serviceBaseUri + 'api/values';

                $http.get(apiUrl).success(function (data) {
                    items = data;
                    if (saveLocal(items)) {
                        deferred.resolve(queryLocal());
                    }
                    else {
                        deferred.resolve();
                    }
                }).error(function (data, status, headers, config) {
                    if (status == 401) {
                        setLocalStorage([]);
                    }
                    deferred.reject(status);
                });
            }
            return deferred.promise;
        }

        var resource = {};

        resource.query = query;
        resource.queryLocal = queryLocal;

        return resource;
    }

    app.factory('authInterceptorService', AuthInterceptorService);
    AuthInterceptorService.$inject = ['$injector', '$q', 'localStorageService'];
    function AuthInterceptorService($injector, $q, localStorageService) {

        this.request = function (config) {
            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');

            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }

            return config;
        };

        this.responseError = function (rejection) {
            if (rejection.status === 401) {
                var authService = $injector.get('Auth');

                authService.logout();
            }
            return $q.reject(rejection);
        };

        return this;
    }

    app.factory('Auth', Auth);
    Auth.$inject = ['$http', '$q', 'localStorageService'];
    function Auth($http, $q, localStorageService){
        var authentication = {};

        function getLocalStorage() {
            return localStorageService.get('authorizationData');
        }

        function setLocalStorage(data) {
            localStorageService.set('authorizationData', data);
        }

        function removeLocalStorage() {
            return localStorageService.remove('authorizationData');
        }

        function fillAuthData() {
            var authData = getLocalStorage();

            if (authData) {
                authentication.isAuth = true;
                authentication.userName = authData.userName;
            }
        }

        function login(loginData){
            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            var deferred = $q.defer();

            $http.post(serviceBaseUri + 'token', data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).success(function (response) {

                setLocalStorage({
                    token: response.access_token,
                    userName: loginData.userName
                });

                authentication.isAuth = true;

                deferred.resolve(response);

            }).error(function (err, status) {
                logout();
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function logout() {
            removeLocalStorage();

            authentication.isAuth = false;
            authentication.userName = "";
        }

        var auth = {};
        auth.fillAuthData = fillAuthData;
        auth.login = login;
        auth.logout = logout;

        return auth;
    }
})();