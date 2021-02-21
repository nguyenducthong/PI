(function () {
    'use strict';

    angular.module('EQA.Dictionary').controller('TestMethodsController', TestMethodsController);

    TestMethodsController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities',

        'TestMethodsService',
        '$uibModal'
    ];
    
    function TestMethodsController ($rootScope, $scope, $http, $timeout, settings, utils, service, modal) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.testMethod = null;
        vm.testMethods = [];
        vm.selectedTestMethods = [];

        // pagination
        vm.pageIndex = 0;
        vm.pageSize = 10;

        vm.getTestMethods = function () {
            service.getTestMethods().then(function(data) {
                vm.testMethods = data.content;
                vm.bsTableControl.options.data = vm.testMethods;
                vm.bsTableControl.options.totalRows = data.totalElements;
            });
        };

        vm.bsTableControl = {
            options: {
                data: vm.labs,
                idField: 'id',
                sortable: true,
                striped: true,
                maintainSelected: true,
                clickToSelect: false,
                showColumns: true,
                singleSelect: false,
                showToggle: false,
                pagination: true,
                pageSize: vm.pageSize,
                pageList: [5, 10, 25, 50, 100],
                locale: settings.locale,
                //sidePagination: 'server',
                columns: service.getTableDefinition(),
                onCheck: function (row, $element) {
                    $scope.$apply(function () {
                        vm.selectedTestMethods.push(row);
                    });
                },
                onCheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedTestMethods = rows;
                    });
                },
                onUncheck: function (row, $element) {
                    var index = utils.indexOf(row, vm.selectedTestMethods);
                    if (index >= 0) {
                        $scope.$apply(function () {
                            vm.selectedTestMethods.splice(index, 1);
                        });
                    }
                },
                onUncheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedTestMethods = [];
                    });
                },
                onPageChange: function (index, pageSize) {
                    vm.pageSize = pageSize;
                    vm.pageIndex = index - 1;

                    vm.getTestMethods();
                }
            }
        };

        vm.getTestMethods();

        vm.newTestMethod = function () {
            console.log('here');
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'add_modal.html',
                scope: $scope,
                size: 'md'
            });

            modalInstance.result.then(function (confirm) {
                if (confirm == 'yes') {

                }
            }, function () {
                console.log("cancel");
            });
        }

        $scope.editTestMethods = function (testMethodsId) {
            console.log('here: ' + testMethodsId);
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'edit_modal.html',
                scope: $scope,
                size: 'md'
            });

            modalInstance.result.then(function (confirm) {
                if (confirm == 'yes') {

                }
            }, function () {
                console.log("cancel");
            });
        }

        vm.deleteTestMethods = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'delete_modal.html',
                scope: $scope,
                size: 'md'
            });

            modalInstance.result.then(function (confirm) {
                if (confirm == 'yes') {

                }
            }, function () {
                console.log("cancel");
            });
        }
    }

})();
