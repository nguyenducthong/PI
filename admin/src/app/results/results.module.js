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
            .state('application.reference_results', {
                url: '/reference-results',
                templateUrl: 'results/views/reference_results.html',
                data: {pageTitle: 'Kết quả của bộ mẫu chuẩn'},
                controller: 'ReferenceResultController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Results',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'results/business/ResultService.js',
                                'results/controllers/ReferenceResultController.js',
                            ]
                        });
                    }]
                }
            })

            .state('application.submitted_results', {
                url: '/submitted-results',
                templateUrl: 'results/views/submitted_results.html',
                data: {pageTitle: 'Kết quả của đơn vị'},
                controller: 'SubmittedResultController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Results',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'results/business/ResultService.js',
                                'results/controllers/SubmittedResultController.js',
                            ]
                        });
                    }]
                }
            })

            .state('application.reference_result_set', {
                url: '/reference-result-set',
                templateUrl: 'results/views/reference_result_set.html',
                data: {pageTitle: 'Kết quả bộ mẫu chuẩn'},
                controller: 'ReferenceResultSetController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Results',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'results/business/ResultService.js',
                                'results/controllers/ReferenceResultSetController.js',
                            ]
                        });
                    }]
                }
            })

            .state('application.result_set', {
                url: '/result-set',
                templateUrl: 'results/views/result_set.html',
                data: {pageTitle: 'Kết quả theo vòng'},
                controller: 'ResultSetController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Results',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'results/business/ResultService.js',
                                'results/controllers/ResultSetController.js',
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