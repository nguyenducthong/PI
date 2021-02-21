(function () {
    'use strict';

    EQA.Results = angular.module('EQA.Results', [
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

            // Dashboard
            .state('application.results', {
                url: '/results',
                templateUrl: 'results/views/list.html',
                data: {pageTitle: 'Kết quả theo vòng'},
                controller: 'ResultListController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Results',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'results/business/ResultService.js',
                                'results/controllers/ResultListController.js',
                            ]
                        });
                    }]
                }
            })

            // Result entry
            .state('application.data_entry', {
                url: '/data-entry',
                templateUrl: 'results/views/data_entry.html',
                data: {pageTitle: 'Nhập kết quả'},
                controller: 'ResultEntryController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Results',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'results/business/ResultService.js',
                                'results/controllers/ResultEntryController.js',
                            ]
                        });
                    }]
                }
            })

            // View reports
            .state('application.reports', {
                url: '/reports',
                templateUrl: 'results/views/reports.html',
                data: {pageTitle: 'Xem báo cáo'},
                controller: 'ResultReportController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Results',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'results/business/ResultService.js',
                                'results/controllers/ResultReportController.js',
                            ]
                        });
                    }]
                }
            });
    }]);

})();