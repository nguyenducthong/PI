(function () {
    'use strict';

    angular.module('EQA.Dictionary').service('TestObjectivesService', TestObjectivesService);

    TestObjectivesService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function TestObjectivesService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getTestObjectives = getTestObjectives;
        function getTestObjectives() {
            var results = {content: [
                {id: 1, code: 'MD01', name: 'Mục đích xét nghiêm 01', description: 'Mô tả...' },
                {id: 2, code: 'MD02', name: 'Mục đích xét nghiêm 02', description: 'Mô tả...' },
                {id: 3, code: 'MD03', name: 'Mục đích xét nghiêm 03', description: 'Mô tả...' },
                {id: 4, code: 'MD04', name: 'Mục đích xét nghiêm 04', description: 'Mô tả...' },
                {id: 5, code: 'MD05', name: 'Mục đích xét nghiêm 05', description: 'Mô tả...' },
                {id: 6, code: 'MD06', name: 'Mục đích xét nghiêm 06', description: 'Mô tả...' },
                {id: 7, code: 'MD07', name: 'Mục đích xét nghiêm 07', description: 'Mô tả...' }
            ], totalElements: 7};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editTestObjectives(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                    title: 'Mã mục đích',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'name',
                    title: 'Tên mục đích',
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