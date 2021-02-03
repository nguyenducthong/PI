(function () {
    'use strict';

    angular.module('EQA.Dictionary').service('ReagentsService', ReagentsService);

    ReagentsService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function ReagentsService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getReagents = getReagents;
        function getReagents() {
            var results = {content: [
                {id: 1, code: 'SP01', name: 'Sinh phẩm 01', description: 'Mô tả.....' },
                {id: 2, code: 'SP02', name: 'Sinh phẩm 02', description: 'Mô tả.....' },
                {id: 3, code: 'SP03', name: 'Sinh phẩm 03', description: 'Mô tả.....' },
                {id: 4, code: 'SP04', name: 'Sinh phẩm 04', description: 'Mô tả.....' },
                {id: 5, code: 'SP05', name: 'Sinh phẩm 05', description: 'Mô tả.....' },
                {id: 6, code: 'SP06', name: 'Sinh phẩm 06', description: 'Mô tả.....' },
                {id: 7, code: 'SP07', name: 'Sinh phẩm 07', description: 'Mô tả.....' }
            ], totalElements: 7};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editReagents(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                ,{
                    field: 'code',
                    title: 'Mã sinh phẩm',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'name',
                    title: 'Tên sinh phẩn',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'description',
                    title: 'Mô tả',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
            ];
        }
    }
})();