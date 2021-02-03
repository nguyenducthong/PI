(function () {
    'use strict';

    angular.module('EQA.Results').controller('ResultEntryController', ResultEntryController);

    ResultEntryController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities'
    ];
    
    function ResultEntryController ($rootScope, $scope, $http, $timeout, settings, utils) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

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
