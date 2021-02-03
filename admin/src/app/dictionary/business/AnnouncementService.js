(function () {
    'use strict';

    angular.module('EQA.Dictionary').service('AnnouncementService', AnnouncementService);

    AnnouncementService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function AnnouncementService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getAnnouncements = getAnnouncements;

        function getAnnouncements() {
            var results = {content: [
                {id: 16, title: 'Thông báo về vòng ngoại kiểm số 16', createDate: '2017-10-18 15:20:08', active: 1},
                {id: 15, title: 'Thông báo về vòng ngoại kiểm số 15', createDate: '2017-10-18 15:20:08', active: 1},
                {id: 14, title: 'Thông báo về vòng ngoại kiểm số 14', createDate: '2017-10-18 15:20:08', active: 1},
                {id: 13, title: 'Thông báo về vòng ngoại kiểm số 13', createDate: '2017-10-18 15:20:08', active: 1},
                {id: 12, title: 'Thông báo về vòng ngoại kiểm số 12', createDate: '2017-10-18 15:20:08', active: 0},
                {id: 11, title: 'Thông báo về vòng ngoại kiểm số 11', createDate: '2017-10-18 15:20:08', active: 0},
                {id: 10, title: 'Thông báo về vòng ngoại kiểm số 10', createDate: '2017-10-18 15:20:08', active: 1},
                {id: 9, title: 'Thông báo về vòng ngoại kiểm số 9', createDate: '2017-10-18 15:20:08', active: 1},
            ], totalElements: 8};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editAnnouncement(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
            };

            var _cellNowrap = function (value, row, index, field) {
                return {
                    classes: '',
                    css: {'white-space': 'nowrap'}
                };
            };

            var _cellNowrap2 = function (value, row, index, field) {
                return {
                    classes: '',
                    css: {'white-space': 'nowrap', 'width' : '120px'}
                };
            };

            var _dateFormatter = function (value, row, index) {
                if (!value) {
                    return '';
                }
                return moment(value).format('DD/MM/YYYY HH:mm:ss');
            };

            var _activeFormatter = function (value, row, index) {
                if (value == null) {
                    return '';
                }

                return (value == 1) ? '<span class="text-success">CÓ HIỆU LỰC</span>' : '<span class="text-muted">VÔ HIỆU</span>';
            };

            return [
                {
                    field: 'state',
                    checkbox: true
                }
                ,{
                    field:'',
                    title: 'Thao tác',
                    switchable: true,
                    visible: true,
                    formatter: _tableOperation,
                    cellStyle: _cellNowrap2
                }
                , {
                    field: 'title',
                    title: 'Tiêu đề thông báo',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'createDate',
                    title: 'Ngày tạo',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap,
                    formatter: _dateFormatter
                }
                , {
                    field: 'active',
                    title: 'Có hiệu lực',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap,
                    formatter: _activeFormatter
                }
            ];
        }
    }
})();