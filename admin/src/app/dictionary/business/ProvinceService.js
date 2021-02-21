(function () {
    'use strict';

    angular.module('EQA.Dictionary').service('ProvinceService', ProvinceService);

    ProvinceService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function ProvinceService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getProvinces = getProvinces;

        function getProvinces() {
            var results = {content: [
                {id: 1, code: 'HCM', name: 'TP. Hồ Chí Minh'},
                {id: 2, code: 'DAN', name: 'Đà Nẵng'},
                {id: 3, code: 'BTH', name: 'Bình Thuận'},
                {id: 4, code: 'DNA', name: 'Đồng Nai'},
                {id: 5, code: 'CAT', name: 'Cần Thơ'},
                {id: 6, code: 'ANG', name: 'An Giang'},
                {id: 7, code: 'SOT', name: 'Sóc Trăng'}
            ], totalElements: 7};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editProvince(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                    title: 'Mã tỉnh',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'name',
                    title: 'Tên tỉnh',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
            ];
        }
    }
})();