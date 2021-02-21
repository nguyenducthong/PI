(function () {
    'use strict';

    angular.module('EQA.Dictionary').controller('ProvinceController', ProvinceController);

    ProvinceController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities',

        'ProvinceService',
        '$uibModal'
    ];
    
    function ProvinceController ($rootScope, $scope, $http, $timeout, settings, utils, service, modal) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.province = null;
        vm.provinces = [];
        vm.selectedProvinces = [];

        // pagination
        vm.pageIndex = 0;
        vm.pageSize = 10;

        vm.getProvinces = function () {
            service.getProvinces().then(function(data) {
                vm.provinces = data.content;
                vm.bsTableControl.options.data = vm.provinces;
                vm.bsTableControl.options.totalRows = data.totalElements;
            });
        };

        vm.bsTableControl = {
            options: {
                data: vm.provinces,
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
                        vm.selectedProvinces.push(row);
                    });
                },
                onCheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedProvinces = rows;
                    });
                },
                onUncheck: function (row, $element) {
                    var index = utils.indexOf(row, vm.selectedProvinces);
                    if (index >= 0) {
                        $scope.$apply(function () {
                            vm.selectedProvinces.splice(index, 1);
                        });
                    }
                },
                onUncheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedProvinces = [];
                    });
                },
                onPageChange: function (index, pageSize) {
                    vm.pageSize = pageSize;
                    vm.pageIndex = index - 1;

                    vm.getProvinces();
                }
            }
        };

        vm.getProvinces();

        vm.newProvinces = function () {
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

        $scope.editProvince = function (provinceId) {
            console.log('here: ' + provinceId);
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

        vm.deleteProvinces = function () {
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
