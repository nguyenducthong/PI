(function () {
    'use strict';

    angular.module('EQA.Profile').controller('ProfileController', ProfileController);

    ProfileController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        '$state',
        'Utilities'
    ];
    
    function ProfileController ($rootScope, $scope, $http, $timeout, settings, $state, utils) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.tab = 1;
        vm.tabNames = [
            'THÔNG TIN CHUNG CỦA PHÒNG XÉT NGHIỆM',
            'THÔNG TIN NHÂN SỰ PHÒNG XÉT NGHIỆM',
            'THÔNG TIN CƠ SỞ HẠ TẦNG PHÒNG XÉT NGHIỆM',
            'THÔNG TIN CÁC DỊCH VỤ XÉT NGHIỆM HIV',
            'THÔNG TIN PHƯƠNG CÁCH XÉT NGHIỆM CHẨN ĐOÁN HIV'
        ];

        vm.changeTab = function (tab) {
            vm.tab = tab;
        };

        vm.startEdit = function () {
            $state.go('application.edit_profile');
        };
    }

})();
