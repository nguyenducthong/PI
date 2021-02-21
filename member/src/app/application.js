(function () {
    'use strict';

    /* EQA App */
    if (typeof window.EQA == 'undefined') {
        var EQA = angular.module('EQA', [
            'ui.router',
            'ui.bootstrap',
            'oc.lazyLoad',
            'ngSanitize',
            'ngCookies',
            'angular-oauth2',
            'blockUI',

            // Sub modules
            'EQA.Common',
            'EQA.Dashboard',
            'EQA.Results',
            'EQA.Profile',
            'EQA.Settings'
        ]);

        window.EQA = EQA;
    }

    EQA.API_SERVER_URL = 'http://localhost:8080/eqa/';
    EQA.API_CLIENT_ID = 'eqa_client';
    EQA.API_CLIENT_KEY = 'password';
    EQA.API_V1 = 'api/';

    /* Init global settings and run the app */
    EQA.run(['$rootScope', 'settings', '$http', '$cookies', '$state', '$injector', 'constants', 'OAuth', 'blockUI',
        function ($rootScope, settings, $http, $cookies, $state, $injector, constants, OAuth, blockUI) {
            $rootScope.$state = $state; // state to be accessed from view
            $rootScope.$settings = settings; // state to be accessed from view

            // moment locale
            moment.locale(settings.locale);

            // oauth2...
            // $rootScope.$on('oauth:error', function (event, rejection) {
            //
            //     blockUI.stop();
            //
            //     // Ignore `invalid_grant` error - should be catched on `LoginController`.
            //     if (angular.isDefined(rejection.data) && 'invalid_grant' === rejection.data.error) {
            //         $cookies.remove(constants.oauth2_token);
            //         $state.go('login');
            //
            //         return;
            //     }
            //
            //     // Refresh token when a `invalid_token` error occurs.
            //     if (angular.isDefined(rejection.data) && 'invalid_token' === rejection.data.error) {
            //         return OAuth.getRefreshToken();
            //     }
            //
            //     // Redirect to `/login` with the `error_reason`.
            //     $rootScope.$emit('$unauthorized', function (event, data) {});
            //     $state.go('login');
            // });
            //
            // $rootScope.$on('$locationChangeSuccess', function (event) {
            //
            //     if (!OAuth.isAuthenticated()) {
            //         $rootScope.$emit('$unauthorized', function (event, data) {});
            //         $state.go('login');
            //     }
            //
            //     blockUI.start();
            //     $http.get(settings.api.baseUrl + settings.api.apiV1Url + 'users/getCurrentUser').success(function (response, status, headers, config) {
            //         blockUI.stop();
            //         if (response) {
            //             $rootScope.$emit('$onCurrentUserData', response);
            //         }
            //     }).error(function (response, status, headers, config) {
            //         blockUI.stop();
            //         $cookies.remove(constants.oauth2_token);
            //         $state.go('login');
            //     });
            // });
        }
    ]);

})(window);
