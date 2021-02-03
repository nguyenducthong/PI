(function () {
    'use strict';

    EQA.Settings = angular.module('EQA.Settings', [
        'ui.router',
        'oc.lazyLoad',
        'bsTable',
        'toastr',

        'EQA.Common'
    ]);

    EQA.Settings.config(['$stateProvider', function ($stateProvider) {

        $stateProvider

            // General Settings
            .state('application.settings', {
                url: '/settings',
                templateUrl: 'settings/views/general.html',
                data: {pageTitle: 'Settings'},
                controller: 'SettingsController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Settings',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'settings/controllers/SettingsController.js',
                                'settings/business/SettingsService.js'
                            ]
                        });
                    }]
                }
            });
    }]);

})();