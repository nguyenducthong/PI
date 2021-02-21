(function () {
    'use strict';

    EQA.Results = angular.module('EQA.Profile', [
        'ui.router',
        'oc.lazyLoad',
        'bsTable',
        'toastr',
        'hl.sticky',
        'ui.select',
        'ui.tinymce',

        'EQA.Common'
    ]);

    EQA.Results.config(['$stateProvider', function ($stateProvider) {

        $stateProvider

            // View profile
            .state('application.view_profile', {
                url: '/profile',
                templateUrl: 'profile/views/view.html',
                data: {pageTitle: 'Thông tin của đơn vị'},
                controller: 'ProfileController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Profile',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'profile/business/ProfileService.js',
                                'profile/controllers/ProfileController.js',
                            ]
                        });
                    }]
                }
            })

            // Edit profile
            .state('application.edit_profile', {
                url: '/profile/edit',
                templateUrl: 'profile/views/edit.html',
                data: {pageTitle: 'Cập nhật thông tin đơn vị'},
                controller: 'EditProfileController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Profile',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'profile/business/ProfileService.js',
                                'profile/controllers/EditProfileController.js',
                            ]
                        });
                    }]
                }
            });
    }]);

})();