(function () {
    'use strict';

    angular.module('EQA.Mixture').controller('SerumMixingController', SerumMixingController);

    SerumMixingController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities',

        'SerumMixingService',
        '$uibModal'
    ];
    
    function SerumMixingController ($rootScope, $scope, $http, $timeout, settings, utils, service, modal) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

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

        vm.bank = null;
        vm.banks = [];
        vm.selectedBanks = [];

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

        vm.datetime1 =
        {
            options: {
                dropdownSelector: '#dropdown_datetime1',
                startView: 'day',
                minView: 'day'
            }
        };

        vm.datetime2 =
        {
            options: {
                dropdownSelector: '#dropdown_datetime2',
                startView: 'day',
                minView: 'day'
            }
        };

        vm.datetime3 =
        {
            options: {
                dropdownSelector: '#dropdown_datetime3',
                startView: 'day',
                minView: 'day'
            }
        };

        vm.serumBanks = [
            {id: 1, code: 'EQA-1001-01', originalCode: 'ORIGIN-001'},
            {id: 2, code: 'EQA-1001-02', originalCode: 'ORIGIN-002'},
            {id: 3, code: 'EQA-1001-03', originalCode: 'ORIGIN-003'},
            {id: 4, code: 'EQA-1001-04', originalCode: 'ORIGIN-004'},
            {id: 5, code: 'EQA-1001-05', originalCode: 'ORIGIN-005'},
            {id: 6, code: 'EQA-1001-06', originalCode: 'ORIGIN-006'},
            {id: 7, code: 'EQA-1001-07', originalCode: 'ORIGIN-007'},
            {id: 8, code: 'EQA-1001-08', originalCode: 'ORIGIN-008'}
        ];

        vm.yesNo = [
            {id: 1, name: 'Có'},
            {id: 2, name: 'Không'}
        ];

        vm.newMixture = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'add_edit_modal.html',
                scope: $scope,
                size: 'lg'
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
