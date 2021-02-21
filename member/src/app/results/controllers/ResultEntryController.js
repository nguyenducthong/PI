(function () {
    'use strict';

    angular.module('EQA.Results').controller('ResultEntryController', ResultEntryController);

    ResultEntryController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities',
        '$uibModal'
    ];
    
    function ResultEntryController ($rootScope, $scope, $http, $timeout, settings, utils, modal) {
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

        vm.testMethod = 1;
        vm.testMethodNames = [
            'KẾT QUẢ XÉT NGHIỆM BẰNG KĨ THUẬT TEST NHANH',
            'KẾT QUẢ XÉT NGHIỆM BẰNG KĨ THUẬT NGƯNG KẾT HẠT',
            'KẾT QUẢ XÉT NGHIỆM BẰNG KĨ THUẬT ELISA',
            'KẾT QUẢ XÉT NGHIỆM BẰNG KĨ THUẬT WESTERN BLOT',
            'KẾT QUẢ XÉT NGHIỆM BẰNG KĨ THUẬT HÓA/ĐIỆN PHÁT QUANG',
            'TỔNG HỢP KẾT QUẢ CỦA ĐƠN VỊ'
        ];

        vm.changeTestMethod = function (method) {
            vm.testMethod = method;

        };

        /* TINYMCE */
        vm.tinymceOptions = {
            height: 200,
            theme: 'modern',
            plugins: [
                'lists fullscreen'
            ],
            toolbar1: 'bold underline italic | removeformat | bullist numlist outdent indent | fullscreen',
            content_css: [
                '//fonts.googleapis.com/css?family=Poppins:300,400,500,600,700',
                '/assets/css/tinymce_content.css'
            ],
            statusbar: false,
            menubar: false
        };

        vm.samples = [
            'PI-HIV-201702-01',
            'PI-HIV-201702-02',
            'PI-HIV-201702-03',
            'PI-HIV-201702-04',
            'PI-HIV-201702-05',
            'PI-HIV-201702-06',
            'PI-HIV-201702-07',
            'PI-HIV-201702-08',
            'PI-HIV-201702-09',
            'PI-HIV-201702-10',
        ];
    }

})();
