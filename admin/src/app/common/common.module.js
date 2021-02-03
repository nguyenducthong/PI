(function () {
    'use strict';

    EQA.Common = angular.module('EQA.Common', [
        'ui.router',
        'oc.lazyLoad',
        'toastr',
        'ngCookies',
        'blockUI'
    ]);

    EQA.Common.config(['$stateProvider', function ($stateProvider) {

        $stateProvider

            // Login page
            .state('login', {
                url: '/login',
                templateUrl: 'common/views/login/login.html',
                data: {pageTitle: 'System login'},
                controller: 'LoginController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Common',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'common/controllers/LoginController.js',
                                'common/business/LoginService.js',
                                'assets/css/login.min.css'
                            ]
                        });
                    }]
                }
            });
    }]);

})();