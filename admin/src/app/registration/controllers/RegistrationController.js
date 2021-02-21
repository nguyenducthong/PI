(function () {
    'use strict';

    angular.module('EQA.Registration').controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities',

        'RegistrationService',
        '$uibModal'
    ];
    
    function RegistrationController ($rootScope, $scope, $http, $timeout, settings, utils, service, modal) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.bank = null;
        vm.banks = [];
        vm.selectedBanks = [];

        vm.selectedEqaRound = {id: 16, name: 'Vòng ngoại kiểm số 16', code: 'PI_EQA_ROUND_16'};
        vm.allEqaRounds = [
            {id: 16, name: 'Vòng ngoại kiểm số 16', code: 'PI_EQA_ROUND_16'},
            {id: 15, name: 'Vòng ngoại kiểm số 15', code: 'PI_EQA_ROUND_15'},
            {id: 14, name: 'Vòng ngoại kiểm số 14', code: 'PI_EQA_ROUND_14'},
            {id: 13, name: 'Vòng ngoại kiểm số 13', code: 'PI_EQA_ROUND_13'},
            {id: 12, name: 'Vòng ngoại kiểm số 12', code: 'PI_EQA_ROUND_12'},
            {id: 11, name: 'Vòng ngoại kiểm số 11', code: 'PI_EQA_ROUND_11'},
            {id: 10, name: 'Vòng ngoại kiểm số 10', code: 'PI_EQA_ROUND_10'},
            {id: 9, name: 'Vòng ngoại kiểm số 9', code: 'PI_EQA_ROUND_9'},
            {id: 8, name: 'Vòng ngoại kiểm số 8', code: 'PI_EQA_ROUND_8'},
            {id: 7, name: 'Vòng ngoại kiểm số 7', code: 'PI_EQA_ROUND_7'},
            {id: 6, name: 'Vòng ngoại kiểm số 6', code: 'PI_EQA_ROUND_6'},
            {id: 5, name: 'Vòng ngoại kiểm số 5', code: 'PI_EQA_ROUND_5'},
            {id: 4, name: 'Vòng ngoại kiểm số 4', code: 'PI_EQA_ROUND_4'},
            {id: 3, name: 'Vòng ngoại kiểm số 3', code: 'PI_EQA_ROUND_3'},
            {id: 2, name: 'Vòng ngoại kiểm số 2', code: 'PI_EQA_ROUND_2'},
            {id: 1, name: 'Vòng ngoại kiểm số 1', code: 'PI_EQA_ROUND_1'}
        ];

        vm.changeEqaRound = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'select_round_modal.html',
                scope: $scope,
                size: 'sm'
            });

            modalInstance.result.then(function (confirm) {
                if (confirm == 'yes') {
                }
            }, function () {
                console.log("cancel");
            });
        };

        // pagination
        vm.pageIndex = 0;
        vm.pageSize = 10;

        vm.getSerumBanks = function () {
            service.getSerumBanks().then(function(data) {
                vm.banks = data.content;
                vm.bsTableControl.options.data = vm.banks;
                vm.bsTableControl.options.totalRows = data.totalElements;
            });
        };

        vm.bsTableControl = {
            options: {
                data: vm.banks,
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
                        vm.selectedBanks.push(row);
                    });
                },
                onCheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedBanks = rows;
                    });
                },
                onUncheck: function (row, $element) {
                    var index = utils.indexOf(row, vm.selectedBanks);
                    if (index >= 0) {
                        $scope.$apply(function () {
                            vm.selectedBanks.splice(index, 1);
                        });
                    }
                },
                onUncheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedBanks = [];
                    });
                },
                onPageChange: function (index, pageSize) {
                    vm.pageSize = pageSize;
                    vm.pageIndex = index - 1;

                    vm.getSerumBanks();
                }
            }
        };

        vm.getSerumBanks();

        vm.labs = [
            {id: 1, code: 'LAB-001', name: 'Phòng xét nghiệm 1'},
            {id: 2, code: 'LAB-002', name: 'Phòng xét nghiệm 2'},
            {id: 3, code: 'LAB-003', name: 'Phòng xét nghiệm 3'},
            {id: 4, code: 'LAB-004', name: 'Phòng xét nghiệm 4'},
            {id: 5, code: 'LAB-005', name: 'Phòng xét nghiệm 5'},
            {id: 6, code: 'LAB-006', name: 'Phòng xét nghiệm 6'},
            {id: 7, code: 'LAB-007', name: 'Phòng xét nghiệm 7'},
            {id: 8, code: 'LAB-008', name: 'Phòng xét nghiệm 8'}
        ];
        vm.addNew = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'add_edit_modal.html',
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
