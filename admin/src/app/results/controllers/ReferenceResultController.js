(function () {
    'use strict';

    angular.module('EQA.Results').controller('ReferenceResultController', ReferenceResultController);

    ReferenceResultController.$inject = [
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
    
    function ReferenceResultController ($rootScope, $scope, $http, $timeout, settings, utils, modal, blockUI, toastr, service) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.resultSent = false;

        vm.results = [];
        vm.selectedResult = null;

        // pagination
        vm.pageIndex = 0;
        vm.pageSize = 10;

        vm.getReferenceResults = function () {
            service.getReferenceResults().then(function(data) {
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
                columns: service.getTableDefinition4ReferenceResults(),
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

                    vm.getReferenceResults();
                }
            }
        };

        vm.getReferenceResults();

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
