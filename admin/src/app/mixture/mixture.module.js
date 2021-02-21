(function () {
    'use strict';

    EQA.Mixture = angular.module('EQA.Mixture', [
        'ui.router',
        'oc.lazyLoad',
        'bsTable',
        'toastr',
        'ui.bootstrap.datetimepicker',

        'EQA.Common'
    ]);

    EQA.Mixture.config(['$stateProvider', function ($stateProvider) {

        $stateProvider

            .state('application.serum_banks', {
                url: '/serum-banks',
                templateUrl: 'mixture/views/serum_banks.html',
                data: {pageTitle: 'Danh sách ngân hàng huyết thanh'},
                controller: 'SerumBankController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Mixture',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'mixture/controllers/SerumBankController.js',
                                'mixture/business/SerumBankService.js'
                            ]
                        });
                    }]
                }
            })

            .state('application.serum_mixing', {
                url: '/serum-mixing',
                templateUrl: 'mixture/views/serum_mixing.html',
                data: {pageTitle: 'Pha chế mẫu'},
                controller: 'SerumMixingController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Mixture',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'mixture/controllers/SerumMixingController.js',
                                'mixture/business/SerumMixingService.js'
                            ]
                        });
                    }]
                }
            })

            .state('application.sample_packaging', {
                url: '/sample-packaging',
                templateUrl: 'mixture/views/sample_packaging.html',
                data: {pageTitle: 'Ra tube'},
                controller: 'SamplePackagingController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Mixture',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'mixture/controllers/SamplePackagingController.js',
                                'mixture/business/SamplePackagingService.js'
                            ]
                        });
                    }]
                }
            })

            .state('application.label_printing', {
                url: '/label-printing',
                templateUrl: 'mixture/views/label_printing.html',
                data: {pageTitle: 'In nhãn các loại mã'},
                controller: 'LabelPrintingController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Mixture',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'mixture/controllers/LabelPrintingController.js',
                                'mixture/business/LabelPrintingService.js'
                            ]
                        });
                    }]
                }
            });
    }]);

})();