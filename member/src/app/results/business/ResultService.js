(function () {
    'use strict';

    angular.module('EQA.Results').service('ResultService', ResultService);

    ResultService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function ResultService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getResults = getResults;

        function getResults() {
            var results = {content: [
                {id: 1, round: 'Vòng 12', name: 'PI-HIV-201702-01', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 2, round: 'Vòng 12', name: 'PI-HIV-201702-02', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 3, round: 'Vòng 12', name: 'PI-HIV-201702-03', val: 'Âm tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 4, round: 'Vòng 12', name: 'PI-HIV-201702-04', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 5, round: 'Vòng 12', name: 'PI-HIV-201702-05', val: 'Âm tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 6, round: 'Vòng 12', name: 'PI-HIV-201702-06', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 7, round: 'Vòng 12', name: 'PI-HIV-201702-07', val: 'Không xác định', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 8, round: 'Vòng 12', name: 'PI-HIV-201702-08', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 9, round: 'Vòng 12', name: 'PI-HIV-201702-09', val: 'Âm tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 10, round: 'Vòng 12', name: 'PI-HIV-201702-10', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
            ], totalElements: 10};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _titleFormatter = function (value, row, index) {

                var ret = '';
                ret += '<span class="text-muted">&mdash;</span> ';
                ret += '<a uib-tooltip="Click để xem chi tiết" uib-trigger="mouseenter" href="#/data-entry">' + row.name + '</a>';
                ret += '</span>';

                return ret;
            };

            var _resultFormatter = function (value, row, index) {
                var ret = '';

                ret += '<span class="uppercase';
                ret += (row.val == 'Dương tính') ? ' text-danger' : (row.val == 'Âm tính') ? ' text-green' : '';
                ret += '">';
                ret += row.val + '</span>';

                return ret;
            };

            var _cellNowrap = function (value, row, index, field) {
                return {
                    classes: '',
                    css: {'white-space': 'nowrap'}
                };
            };

            var _dateFormatter = function (value, row, index) {
                if (!value) {
                    return '';
                }
                return moment(value).format('DD/MM/YYYY HH:mm:ss');
            };

            return [
                // {
                //     field: 'state',
                //     checkbox: true
                // }
                {
                    field: 'round',
                    title: 'Vòng ngoại kiểm',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'name',
                    title: 'Mấu xét nghiệm',
                    sortable: true,
                    switchable: false,
                    formatter: _titleFormatter
                }
                , {
                    field: 'val',
                    title: 'Kết quả cuối cùng',
                    sortable: true,
                    switchable: false,
                    formatter: _resultFormatter,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'testDate',
                    title: 'Ngày thực hiện',
                    sortable: true,
                    switchable: true,
                    visible: true,
                    formatter: _dateFormatter,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'entryDate',
                    title: 'Ngày nhập kết quả',
                    sortable: true,
                    switchable: true,
                    visible: true,
                    formatter: _dateFormatter,
                    cellStyle: _cellNowrap
                }
            ];
        }
    }
})();