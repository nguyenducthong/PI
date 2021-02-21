(function () {
    'use strict';

    angular.module('EQA.Mixture').service('SerumMixingService', SerumMixingService);

    SerumMixingService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function SerumMixingService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getSerumBanks = getSerumBanks;

        function getSerumBanks() {
            var results = {content: [
                {id: 1, code: 'EQA-1001-01', originalCode: 'ORIGIN-001', originalContent: 1, addedThrombin: 20, deactivateRequired: 'Có', antiHiv: 'Dương tính'},
                {id: 2, code: 'EQA-1001-02', originalCode: 'ORIGIN-002', originalContent: 0.5, addedThrombin: 15, deactivateRequired: 'Có', antiHiv: 'Dương tính'},
                {id: 3, code: 'EQA-1001-03', originalCode: 'ORIGIN-003', originalContent: 1, addedThrombin: 4, deactivateRequired: 'Không', antiHiv: 'Âm tính'},
                {id: 4, code: 'EQA-1001-04', originalCode: 'ORIGIN-004', originalContent: 1.5, addedThrombin: 12, deactivateRequired: 'Không', antiHiv: 'Dương tính'},
                {id: 5, code: 'EQA-1001-05', originalCode: 'ORIGIN-005', originalContent: 0.5, addedThrombin: 11, deactivateRequired: 'Không', antiHiv: 'Âm tính'},
                {id: 6, code: 'EQA-1001-06', originalCode: 'ORIGIN-006', originalContent: 1, addedThrombin: 7, deactivateRequired: 'Có', antiHiv: 'Dương tính'},
                {id: 7, code: 'EQA-1001-07', originalCode: 'ORIGIN-007', originalContent: 1, addedThrombin: 6, deactivateRequired: 'Có', antiHiv: 'Âm tính'}
            ], totalElements: 7};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editBank(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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

            var _contentFormatter = function (value, row, index) {
                if (!value) {
                    return '';
                }

                return value + ' lít';
            };

            var _thrombinFormatter = function (value, row, index) {
                if (!value) {
                    return '';
                }

                return value + ' ul';
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
                    title: 'Mã ngân hàng',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'originalCode',
                    title: 'Mã nguyên bản',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'antiHiv',
                    title: 'Tình trạng nhiễm HIV',
                    sortable: true,
                    switchable: true,
                    visible: true,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'originalContent',
                    title: 'Dung tích ban đầu',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap,
                    formatter: _contentFormatter
                }
                , {
                    field: 'addedThrombin',
                    title: 'Lượng thrombin thêm vào',
                    sortable: true,
                    switchable: true,
                    cellStyle: _cellNowrap,
                    formatter: _thrombinFormatter
                }
                , {
                    field: 'deactivateRequired',
                    title: 'Cần bất hoạt virus?',
                    sortable: true,
                    switchable: true,
                    visible: true,
                    cellStyle: _cellNowrap
                }
            ];
        }
    }
})();