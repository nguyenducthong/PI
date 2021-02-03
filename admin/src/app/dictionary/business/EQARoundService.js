(function () {
    'use strict';

    angular.module('EQA.Dictionary').service('EQARoundService', EQARoundService);

    EQARoundService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function EQARoundService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getRounds = getRounds;

        function getRounds() {
            var results = {content: [
                {id: 16, code: 'PI_EQA_ROUND_16', name: 'Vòng ngoại kiểm số 16', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 15, code: 'PI_EQA_ROUND_15', name: 'Vòng ngoại kiểm số 15', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 14, code: 'PI_EQA_ROUND_14', name: 'Vòng ngoại kiểm số 14', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 13, code: 'PI_EQA_ROUND_13', name: 'Vòng ngoại kiểm số 13', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 12, code: 'PI_EQA_ROUND_12', name: 'Vòng ngoại kiểm số 12', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 11, code: 'PI_EQA_ROUND_11', name: 'Vòng ngoại kiểm số 11', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 10, code: 'PI_EQA_ROUND_10', name: 'Vòng ngoại kiểm số 10', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 9, code: 'PI_EQA_ROUND_09', name: 'Vòng ngoại kiểm số 9', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 8, code: 'PI_EQA_ROUND_08', name: 'Vòng ngoại kiểm số 8', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 7, code: 'PI_EQA_ROUND_07', name: 'Vòng ngoại kiểm số 7', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 6, code: 'PI_EQA_ROUND_06', name: 'Vòng ngoại kiểm số 6', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 5, code: 'PI_EQA_ROUND_05', name: 'Vòng ngoại kiểm số 5', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 4, code: 'PI_EQA_ROUND_04', name: 'Vòng ngoại kiểm số 4', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 3, code: 'PI_EQA_ROUND_03', name: 'Vòng ngoại kiểm số 3', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 2, code: 'PI_EQA_ROUND_02', name: 'Vòng ngoại kiểm số 2', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
                {id: 1, code: 'PI_EQA_ROUND_01', name: 'Vòng ngoại kiểm số 1', startDate: '2017-10-18 00:00:00', endDate: '2017-12-18 00:00:00'},
            ], totalElements: 16};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editRound(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                return moment(value).format('DD/MM/YYYY');
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
                    title: 'Mã vòng',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'name',
                    title: 'Tên vòng',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'startDate',
                    title: 'Ngày bắt đầu',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap,
                    formatter: _dateFormatter
                }
                , {
                    field: 'endDate',
                    title: 'Ngày kết thúc',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap,
                    formatter: _dateFormatter
                }
            ];
        }
    }
})();