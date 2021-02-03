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

        self.getReferenceResults = getReferenceResults;
        self.getTableDefinition4ReferenceResults = getTableDefinition4ReferenceResults;

        self.getSubmittedResults = getSubmittedResults;
        self.getTableDefinition4SubmittedResults = getTableDefinition4SubmittedResults;

        function getResults() {
            var results = {content: [
                {id: 1, round: 'Vòng 16', name: 'PI-HIV-201702-01', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 2, round: 'Vòng 16', name: 'PI-HIV-201702-02', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 3, round: 'Vòng 16', name: 'PI-HIV-201702-03', val: 'Âm tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 4, round: 'Vòng 16', name: 'PI-HIV-201702-04', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 5, round: 'Vòng 16', name: 'PI-HIV-201702-05', val: 'Âm tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 6, round: 'Vòng 16', name: 'PI-HIV-201702-06', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 7, round: 'Vòng 16', name: 'PI-HIV-201702-07', val: 'Không xác định', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 8, round: 'Vòng 16', name: 'PI-HIV-201702-08', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 9, round: 'Vòng 16', name: 'PI-HIV-201702-09', val: 'Âm tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
                {id: 10, round: 'Vòng 16', name: 'PI-HIV-201702-10', val: 'Dương tính', testDate: '2017-10-18 15:28:55', entryDate: '2017-10-20 14:20:55'},
            ], totalElements: 10};

            return $q.when(results);
        }

        function getReferenceResults() {
            var results = {content: [
                {id: 1, round: 'Vòng 16', description: 'Bộ mẫu chuẩn của vòng ngoại kiểm số 12', entryDate: '2017-10-20 14:20:55'},
                {id: 2, round: 'Vòng 11', description: 'Bộ mẫu chuẩn của vòng ngoại kiểm số 11', entryDate: '2017-10-20 14:20:55'},
                {id: 3, round: 'Vòng 10', description: 'Bộ mẫu chuẩn của vòng ngoại kiểm số 10', entryDate: '2017-10-20 14:20:55'},
                {id: 4, round: 'Vòng 09', description: 'Bộ mẫu chuẩn của vòng ngoại kiểm số 09', entryDate: '2017-10-20 14:20:55'},
                {id: 5, round: 'Vòng 08', description: 'Bộ mẫu chuẩn của vòng ngoại kiểm số 08', entryDate: '2017-10-20 14:20:55'},
                {id: 6, round: 'Vòng 07', description: 'Bộ mẫu chuẩn của vòng ngoại kiểm số 07', entryDate: '2017-10-20 14:20:55'},
                {id: 7, round: 'Vòng 06', description: 'Bộ mẫu chuẩn của vòng ngoại kiểm số 06', entryDate: '2017-10-20 14:20:55'},
                {id: 8, round: 'Vòng 05', description: 'Bộ mẫu chuẩn của vòng ngoại kiểm số 05', entryDate: '2017-10-20 14:20:55'},
                {id: 9, round: 'Vòng 04', description: 'Bộ mẫu chuẩn của vòng ngoại kiểm số 04', entryDate: '2017-10-20 14:20:55'},
                {id: 10, round: 'Vòng 03', description: 'Bộ mẫu chuẩn của vòng ngoại kiểm số 03', entryDate: '2017-10-20 14:20:55'}
            ], totalElements: 10};

            return $q.when(results);
        }

        function getSubmittedResults() {
            var results = {content: [
                {id: 1, round: 'Vòng 16', name: 'Phòng xét nghiệm 12', parentName: 'Bệnh viện 12', address: '12 Đường Hoàng Quốc Việt', entryDate: '2017-10-20 14:20:55'},
                {id: 2, round: 'Vòng 16', name: 'Phòng xét nghiệm 11', parentName: 'Bệnh viện 11', address: '12 Đường Hoàng Quốc Việt', entryDate: '2017-10-20 14:20:55'},
                {id: 3, round: 'Vòng 16', name: 'Phòng xét nghiệm 10', parentName: 'Bệnh viện 10', address: '12 Đường Hoàng Quốc Việt', entryDate: '2017-10-20 14:20:55'},
                {id: 4, round: 'Vòng 16', name: 'Phòng xét nghiệm 09', parentName: 'Bệnh viện 09', address: '12 Đường Hoàng Quốc Việt', entryDate: '2017-10-20 14:20:55'},
                {id: 5, round: 'Vòng 16', name: 'Phòng xét nghiệm 08', parentName: 'Bệnh viện 08', address: '12 Đường Hoàng Quốc Việt', entryDate: '2017-10-20 14:20:55'},
                {id: 6, round: 'Vòng 16', name: 'Phòng xét nghiệm 07', parentName: 'Bệnh viện 07', address: '12 Đường Hoàng Quốc Việt', entryDate: '2017-10-20 14:20:55'},
                {id: 7, round: 'Vòng 16', name: 'Phòng xét nghiệm 06', parentName: 'Bệnh viện 06', address: '12 Đường Hoàng Quốc Việt', entryDate: '2017-10-20 14:20:55'},
                {id: 8, round: 'Vòng 16', name: 'Phòng xét nghiệm 05', parentName: 'Bệnh viện 05', address: '12 Đường Hoàng Quốc Việt', entryDate: '2017-10-20 14:20:55'},
                {id: 9, round: 'Vòng 16', name: 'Phòng xét nghiệm 04', parentName: 'Bệnh viện 04', address: '12 Đường Hoàng Quốc Việt', entryDate: '2017-10-20 14:20:55'},
                {id: 10, round: 'Vòng 16', name: 'Phòng xét nghiệm 03', parentName: 'Bệnh viện 03', address: '12 Đường Hoàng Quốc Việt', entryDate: '2017-10-20 14:20:55'}
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

        function getTableDefinition4ReferenceResults() {

            var _titleFormatter = function (value, row, index) {

                var ret = '';
                ret += '<span class="text-muted">&mdash;</span> ';
                ret += '<a uib-tooltip="Click để xem chi tiết" uib-trigger="mouseenter" href="#/reference-result-set">' + row.description + '</a>';
                ret += '</span>';

                return ret;
            };

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editLabs(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                {
                    field: 'state',
                    checkbox: true
                }
                ,{
                    field: '',
                    title: 'Thao tác',
                    formatter: _tableOperation,
                }
                ,{
                    field: 'round',
                    title: 'Vòng ngoại kiểm',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'description',
                    title: 'Mô tả',
                    sortable: true,
                    switchable: false,
                    formatter: _titleFormatter
                }
                , {
                    field: 'entryDate',
                    title: 'Ngày nhập liệu',
                    sortable: true,
                    switchable: true,
                    visible: true,
                    formatter: _dateFormatter,
                    cellStyle: _cellNowrap
                }
            ];
        }

        function getTableDefinition4SubmittedResults() {

            var _titleFormatter = function (value, row, index) {

                var ret = '';
                ret += '<span class="text-muted">&mdash;</span> ';
                ret += '<a uib-tooltip="Click để xem chi tiết" uib-trigger="mouseenter" href="#/result-set">' + row.name + '</a>';
                ret += '</span>';

                return ret;
            };

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editLabs(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                {
                    field: 'state',
                    checkbox: true
                }
                ,{
                    field: '',
                    title: 'Thao tác',
                    formatter: _tableOperation,
                }
                ,{
                    field: 'round',
                    title: 'Vòng ngoại kiểm',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                ,{
                    field: 'name',
                    title: 'Phòng xét nghiệm',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap,
                    formatter: _titleFormatter
                }
                ,{
                    field: 'parentName',
                    title: 'Tên đơn vị',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                ,{
                    field: 'address',
                    title: 'Địa chỉ đơn vị',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
            ];
        }
    }
})();