(function () {
    'use strict';

    angular.module('EQA.Registration').service('RegistrationService', RegistrationService);

    RegistrationService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function RegistrationService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getSerumBanks = getSerumBanks;

        function getSerumBanks() {
            var results = {content: [
                {id: 1, round: 'Vòng 16', code: 'LAB-01', name: 'Phòng xét nghiệm 1', parentName: 'Bệnh viện 1', registrationDate: '2017-10-20 14:20:55'},
                {id: 2, round: 'Vòng 16', code: 'LAB-02', name: 'Phòng xét nghiệm 2', parentName: 'Bệnh viện 2', registrationDate: '2017-10-20 14:20:55'},
                {id: 3, round: 'Vòng 16', code: 'LAB-03', name: 'Phòng xét nghiệm 3', parentName: 'Bệnh viện 3', registrationDate: '2017-10-20 14:20:55'},
                {id: 4, round: 'Vòng 16', code: 'LAB-04', name: 'Phòng xét nghiệm 4', parentName: 'Bệnh viện 4', registrationDate: '2017-10-20 14:20:55'},
                {id: 5, round: 'Vòng 16', code: 'LAB-05', name: 'Phòng xét nghiệm 5', parentName: 'Bệnh viện 5', registrationDate: '2017-10-20 14:20:55'},
                {id: 6, round: 'Vòng 16', code: 'LAB-06', name: 'Phòng xét nghiệm 6', parentName: 'Bệnh viện 6', registrationDate: '2017-10-20 14:20:55'},
                {id: 7, round: 'Vòng 16', code: 'LAB-07', name: 'Phòng xét nghiệm 7', parentName: 'Bệnh viện 7', registrationDate: '2017-10-20 14:20:55'},
                {id: 8, round: 'Vòng 16', code: 'LAB-08', name: 'Phòng xét nghiệm 8', parentName: 'Bệnh viện 8', registrationDate: '2017-10-20 14:20:55'},
            ], totalElements: 8};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
//            	data-ng-click="$parent.editBank(' + "'" + row.id + "'" + ')"
                return '<a class="green-dark margin-right-20" href="#/profile" ><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                    field: 'round',
                    title: 'Vòng ngoại kiểm',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'code',
                    title: 'Mã phòng xét nghiệm',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'name',
                    title: 'Tên phòng xét nghiệm',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap,
                }
                , {
                    field: 'parentName',
                    title: 'Tên đơn vị',
                    sortable: true,
                    switchable: true,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'registrationDate',
                    title: 'Ngày đăng ký',
                    sortable: true,
                    switchable: true,
                    visible: true,
                    cellStyle: _cellNowrap,
                    formatter: _dateFormatter
                }
            ];
        }
    }
})();