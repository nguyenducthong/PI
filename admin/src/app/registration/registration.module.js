(function () {
    'use strict';

    EQA.Registration = angular.module('EQA.Registration', [
        'ui.router',
        'oc.lazyLoad',
        'bsTable',
        'toastr',

        'EQA.Common'
    ]);

    EQA.Registration.config(['$stateProvider', function ($stateProvider) {

        $stateProvider

            .state('application.register_lab', {
                url: '/register-lab',
                templateUrl: 'registration/views/registration.html',
                data: {pageTitle: 'Danh sách ngân hàng huyết thanh'},
                controller: 'RegistrationController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Registration',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'registration/controllers/RegistrationController.js',
                                'registration/business/RegistrationService.js'
                            ]
                        });
                    }]
                }
            })
    }]);

})();