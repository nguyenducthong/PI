(function () {
    'use strict';

    angular.module('EQA.Results').controller('ResultListController', ResultListController);

    ResultListController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities',
        '$uibModal',
        'blockUI',
        'toastr',

        'ResultService'
    ];
    
    function ResultListController ($rootScope, $scope, $http, $timeout, settings, utils, modal, blockUI, toastr, service) {
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

        vm.resultSent = false;

        vm.results = [];
        vm.selectedResult = null;

        // pagination
        vm.pageIndex = 0;
        vm.pageSize = 10;

        vm.getResults = function () {
            service.getResults().then(function(data) {
                vm.results = data.content;
                vm.bsTableControl.options.data = vm.results;
                vm.bsTableControl.options.totalRows = data.totalElements;

                console.log(vm.results);
            });
        };

        vm.bsTableControl = {
            options: {
                data: vm.results,
                idField: 'id',
                sortable: true,
                striped: true,
                maintainSelected: true,
                clickToSelect: false,
                showColumns: true,
                singleSelect: true,
                showToggle: false,
                pagination: true,
                pageSize: vm.pageSize,
                pageList: [5, 10, 25, 50, 100],
                locale: settings.locale,
                //sidePagination: 'server',
                columns: service.getTableDefinition(),
                onCheck: function (row, $element) {
                    $scope.$apply(function () {
                        vm.selectedResult = row;
                    });
                },
                onUncheck: function (row, $element) {
                    $scope.$apply(function () {
                        vm.selectedResult = null;
                    });
                },
                onPageChange: function (index, pageSize) {
                    vm.pageSize = pageSize;
                    vm.pageIndex = index - 1;

                    vm.getResults();
                }
            }
        };

        vm.getResults();

        vm.sendResult = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'confirm_send_result_modal.html',
                scope: $scope,
                size: 'md'
            });

            modalInstance.result.then(function (confirm) {
                if (confirm == 'yes') {
                    blockUI.start();

                    $timeout(function () {
                        blockUI.stop();
                        toastr.info('Kết quả ngoại kiểm vòng số 12 đã được gửi đi thành công.', 'Thông báo');
                        vm.resultSent = true;
                    }, 500);
                }
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
    }

})();
