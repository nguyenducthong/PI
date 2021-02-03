(function () {
    'use strict';

    angular.module('EQA.Dictionary').service('OrgTypeService', OrgTypeService);

    OrgTypeService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function OrgTypeService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getAllTypes = getAllTypes;

        function getAllTypes() {
            var results = {content: [
                {id: 1, code: 'ORG_TYPE_01', name: 'Loại đơn vị số 1', description: 'Mô tả...'},
                {id: 2, code: 'ORG_TYPE_02', name: 'Loại đơn vị số 2', description: 'Mô tả...'},
                {id: 3, code: 'ORG_TYPE_03', name: 'Loại đơn vị số 3', description: 'Mô tả...'},
                {id: 4, code: 'ORG_TYPE_04', name: 'Loại đơn vị số 4', description: 'Mô tả...'},
                {id: 5, code: 'ORG_TYPE_05', name: 'Loại đơn vị số 5', description: 'Mô tả...'},
                {id: 6, code: 'ORG_TYPE_06', name: 'Loại đơn vị số 6', description: 'Mô tả...'},
                {id: 7, code: 'ORG_TYPE_07', name: 'Loại đơn vị số 7', description: 'Mô tả...'},
                {id: 8, code: 'ORG_TYPE_08', name: 'Loại đơn vị số 8', description: 'Mô tả...'},
            ], totalElements: 8};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editOrgType(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                    field: 'code',
                    title: 'Mã loại đơn vị',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'name',
                    title: 'Tên loại đơn vị',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'description',
                    title: 'Mô tả',
                    sortable: true,
                    switchable: false
                }
            ];
        }
    }
})();