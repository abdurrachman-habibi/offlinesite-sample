(function () {
    var app = angular.module('app', ['ngTouch', 'ngMaterial', 'ngRoute', 'LocalStorageModule']);

    app.run(['$route', 'Auth', function ($route, Auth) {
        Auth.fillAuthData();
    }]);

    app.config(['$httpProvider', '$routeProvider', 'routes', function ($httpProvider, $routeProvider, routes) {
        $httpProvider.interceptors.push('authInterceptorService');

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.configuration);
        });

        $routeProvider.otherwise({redirectTo: '/'});
    }]);

    var constantRoutes = [
        {
            url: '/',
            configuration: {
                templateUrl: 'templates/home.html'
            }
        }, {
            url: '/login',
            configuration: {
                templateUrl: 'templates/login.html'
            }
        }
    ];

    app.constant('routes', constantRoutes);
})();
