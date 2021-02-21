(function () {
    'use strict';

    EQA.Dashboard = angular.module('EQA.Dashboard', [
        'ui.router',
        'oc.lazyLoad',
        'bsTable',
        'toastr',
        'ngMap',

        'EQA.Common'
    ]);

    EQA.Dashboard.config(['$stateProvider', function ($stateProvider) {

        $stateProvider

            // Dashboard
            .state('application.dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/views/general.html',
                data: {pageTitle: 'Dashboard'},
                controller: 'DashboardController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Dashboard',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'dashboard/controllers/DashboardController.js',
                            ]
                        });
                    }]
                }
            });
    }]);

})();