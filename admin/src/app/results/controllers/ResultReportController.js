(function () {
    'use strict';

    angular.module('EQA.Results').controller('ResultReportController', ResultReportController);

    ResultReportController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities'
    ];
    
    function ResultReportController ($rootScope, $scope, $http, $timeout, settings, utils) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.reportTab = 1;
        vm.reports = {
            report_1: 'assets/files/report_01.pdf',
            report_2: 'assets/files/report_01.pdf',
            report_3: 'assets/files/report_01.pdf'
        };

        vm.changeTab = function (tab) {
            vm.reportTab = tab;
        };
    }

})();
