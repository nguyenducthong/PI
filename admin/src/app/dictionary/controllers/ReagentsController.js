(function () {
    'use strict';

    angular.module('EQA.Dictionary').controller('ReagentsController', ReagentsController);

    ReagentsController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities',

        'ReagentsService',
        '$uibModal'
    ];
    
    function ReagentsController ($rootScope, $scope, $http, $timeout, settings, utils, service, modal) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.reagent = null;
        vm.reagents = [];
        vm.selectedReagents = [];

        // pagination
        vm.pageIndex = 0;
        vm.pageSize = 10;

        vm.getReagents = function () {
            service.getReagents().then(function(data) {
                vm.reagents = data.content;
                vm.bsTableControl.options.data = vm.reagents;
                vm.bsTableControl.options.totalRows = data.totalElements;
            });
        };

        vm.bsTableControl = {
            options: {
                data: vm.reagents,
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
                        vm.selectedReagents.push(row);
                    });
                },
                onCheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedReagents = rows;
                    });
                },
                onUncheck: function (row, $element) {
                    var index = utils.indexOf(row, vm.selectedReagents);
                    if (index >= 0) {
                        $scope.$apply(function () {
                            vm.selectedReagents.splice(index, 1);
                        });
                    }
                },
                onUncheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedReagents = [];
                    });
                },
                onPageChange: function (index, pageSize) {
                    vm.pageSize = pageSize;
                    vm.pageIndex = index - 1;

                    vm.getReagents();
                }
            }
        };

        vm.getReagents();

        vm.newReagent = function () {
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

        $scope.editReagents = function (reagentId) {
            console.log('here: ' + reagentId);
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

        vm.deleteReagents = function () {
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
