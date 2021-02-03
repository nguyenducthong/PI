(function () {
    'use strict';

    angular.module('EQA.Dictionary').service('TestMethodsService', TestMethodsService);

    TestMethodsService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function TestMethodsService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getTestMethods = getTestMethods;
        function getTestMethods() {
            var results = {content: [
                {id: 1, name: 'PT01', measure: 'Số đo chuẩn đoán 01'},
                {id: 2, name: 'PT02', measure: 'Số đo chuẩn đoán 02'},
                {id: 3, name: 'PT03', measure: 'Số đo chuẩn đoán 03'},
                {id: 4, name: 'PT04', measure: 'Số đo chuẩn đoán 04'},
                {id: 5, name: 'PT05', measure: 'Số đo chuẩn đoán 05'},
                {id: 6, name: 'PT06', measure: 'Số đo chuẩn đoán 06'},
                {id: 7, name: 'PT07', measure: 'Số đo chuẩn đoán 07'}
            ], totalElements: 7};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editTestMethods(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                    field: 'name',
                    title: 'Tên phương cách',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'measure',
                    title: 'Số đo chuẩn đoán',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
            ];
        }
    }
})();