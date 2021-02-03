(function () {
    'use strict';

    angular.module('EQA.Dictionary').controller('AnnouncementController', AnnouncementController);

    AnnouncementController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities',
        '$uibModal',

        'AnnouncementService'
    ];
    
    function AnnouncementController ($rootScope, $scope, $http, $timeout, settings, utils, modal, service) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.announcement = null;
        vm.announcements = [];
        vm.selectedAnnouncements = [];

        // pagination
        vm.pageIndex = 0;
        vm.pageSize = 10;

        vm.getAnnouncements = function () {
            service.getAnnouncements().then(function(data) {
                vm.announcements = data.content;
                vm.bsTableControl.options.data = vm.announcements;
                vm.bsTableControl.options.totalRows = data.totalElements;
            });
        };

        vm.bsTableControl = {
            options: {
                data: vm.announcements,
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
                        vm.selectedAnnouncements.push(row);
                    });
                },
                onCheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedAnnouncements = rows;
                    });
                },
                onUncheck: function (row, $element) {
                    var index = utils.indexOf(row, vm.selectedAnnouncements);
                    if (index >= 0) {
                        $scope.$apply(function () {
                            vm.selectedAnnouncements.splice(index, 1);
                        });
                    }
                },
                onUncheckAll: function (rows) {
                    $scope.$apply(function () {
                        vm.selectedAnnouncements = [];
                    });
                },
                onPageChange: function (index, pageSize) {
                    vm.pageSize = pageSize;
                    vm.pageIndex = index - 1;

                    vm.getAnnouncements();
                }
            }
        };

        vm.getAnnouncements();

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

        vm.newAnnouncement = function () {
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
