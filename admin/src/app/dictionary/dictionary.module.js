(function () {
    'use strict';

    EQA.Dictionary = angular.module('EQA.Dictionary', [
        'ui.router',
        'oc.lazyLoad',
        'bsTable',
        'toastr',
        'ui.tinymce',

        'EQA.Common'
    ]);

    EQA.Dictionary.config(['$stateProvider', function ($stateProvider) {

        $stateProvider

            .state('application.provinces', {
                url: '/dictionary/provinces',
                templateUrl: 'dictionary/views/provinces.html',
                data: {pageTitle: 'Danh mục tỉnh - thành phố'},
                controller: 'ProvinceController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Dictionary',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'dictionary/controllers/ProvinceController.js',
                                'dictionary/business/ProvinceService.js'
                            ]
                        });
                    }]
                }
            })

            .state('application.eqa_rounds', {
                url: '/dictionary/eqa_rounds',
                templateUrl: 'dictionary/views/eqa_rounds.html',
                data: {pageTitle: 'Danh mục vỏng ngoại kiểm'},
                controller: 'EQARoundController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Dictionary',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'dictionary/controllers/EQARoundController.js',
                                'dictionary/business/EQARoundService.js'
                            ]
                        });
                    }]
                }
            })

            .state('application.org_types', {
                url: '/dictionary/org_types',
                templateUrl: 'dictionary/views/org_types.html',
                data: {pageTitle: 'Danh mục loại đơn vị'},
                controller: 'OrgTypeController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Dictionary',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'dictionary/controllers/OrgTypeController.js',
                                'dictionary/business/OrgTypeService.js'
                            ]
                        });
                    }]
                }
            })


            .state('application.announcements', {
                url: '/announcements',
                templateUrl: 'dictionary/views/announcements.html',
                data: {pageTitle: 'Danh mục các thông báo chung'},
                controller: 'AnnouncementController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Dictionary',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'dictionary/controllers/AnnouncementController.js',
                                'dictionary/business/AnnouncementService.js'
                            ]
                        });
                    }]
                }
            })

            .state('application.labs', {
                url: '/dictionary/labs',
                templateUrl: 'dictionary/views/labs.html',
                data: {pageTitle: 'Danh mục phòng xét nghiệm'},
                controller: 'LabsController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Dictionary',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'dictionary/controllers/LabsController.js',
                                'dictionary/business/LabsService.js'
                            ]
                        });
                    }]
                }
            })

            .state('application.skills', {
                url: '/dictionary/skills',
                templateUrl: 'dictionary/views/skills.html',
                data: {pageTitle: 'Danh mục trình độ chuyên môn'},
                controller: 'SkillsController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Dictionary',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'dictionary/controllers/SkillsController.js',
                                'dictionary/business/SkillsService.js'
                            ]
                        });
                    }]
                }
            })

            .state('application.test_objectives', {
                url: '/dictionary/test_objectives',
                templateUrl: 'dictionary/views/test_objectives.html',
                data: {pageTitle: 'Mục đích xét nghiệm'},
                controller: 'TestObjectivesController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Dictionary',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'dictionary/controllers/TestObjectivesController.js',
                                'dictionary/business/TestObjectivesService.js'
                            ]
                        });
                    }]
                }
            })

            .state('application.test_methods', {
                url: '/dictionary/test_methods',
                templateUrl: 'dictionary/views/test_methods.html',
                data: {pageTitle: 'Phương cách xét nghiệm'},
                controller: 'TestMethodsController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Dictionary',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'dictionary/controllers/TestMethodsController.js',
                                'dictionary/business/TestMethodsService.js'
                            ]
                        });
                    }]
                }
            })

            .state('application.reagents', {
                url: '/dictionary/reagents',
                templateUrl: 'dictionary/views/reagents.html',
                data: {pageTitle: 'Danh mục sinh phẩm'},
                controller: 'ReagentsController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'EQA.Dictionary',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'dictionary/controllers/ReagentsController.js',
                                'dictionary/business/ReagentsService.js'
                            ]
                        });
                    }]
                }
            });
    }]);

})();