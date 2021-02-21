(function () {
    'use strict';

    angular.module('EQA.Dictionary').controller('OrgTypeController', OrgTypeController);

    OrgTypeController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities',

        'OrgTypeService',
        '$uibModal'
    ];
    
    function OrgTypeController ($rootScope, $scope, $http, $timeout, settings, utils, service, modal) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.orgType = null;
        vm.orgTypes = [];
        vm.selectedOrgTypes = [];

        // pagination
        vm.pageIndex = 0;
        vm.pageSize = 10;

        vm.getAllTypes = function () {
            service.getAllTypes().then(function(data) {
                vm.orgTypes = data.content;
                vm.bsTableControl.options.data = vm.orgTypes;
                vm.bsTableControl.options.totalRows = data.totalElements;
            });
        };

        vm.bsTableControl = {
            options: {
                data: vm.orgTypes,
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
                        vm.selectedOrgTypes.push(row);
                    });
                },
                onCheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedOrgTypes = rows;
                    });
                },
                onUncheck: function (row, $element) {
                    var index = utils.indexOf(row, vm.selectedOrgTypes);
                    if (index >= 0) {
                        $scope.$apply(function () {
                            vm.selectedOrgTypes.splice(index, 1);
                        });
                    }
                },
                onUncheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedOrgTypes = [];
                    });
                },
                onPageChange: function (index, pageSize) {
                    vm.pageSize = pageSize;
                    vm.pageIndex = index - 1;

                    vm.getAllTypes();
                }
            }
        };

        vm.getAllTypes();

        vm.newOrgType = function () {
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

        $scope.editOrgType = function (orgTypeId) {
            console.log('here: ' + orgTypeId);
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

        vm.deleteOrgTypes = function () {
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
