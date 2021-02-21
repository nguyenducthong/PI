(function () {
    'use strict';

    angular.module('EQA.Dictionary').service('LabsService', LabsService);

    LabsService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function LabsService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getLabs = getLabs;
        function getLabs() {
            var results = {content: [
                {id: 1, typeTest: 'ME03', department: 'Xét nghiệm 01',purpose: 'Kiểm tra 01', specimenNumber: '10', description: 'Mô tả 1...' },
                {id: 2, typeTest: 'ME04', department: 'Xét nghiệm 02',purpose: 'Kiểm tra 02', specimenNumber: '8', description: 'Mô tả 2...' },
                {id: 3, typeTest: 'ME05', department: 'Xét nghiệm 03',purpose: 'Kiểm tra 03', specimenNumber: '5', description: 'Mô tả 3...' },
                {id: 4, typeTest: 'ME06', department: 'Xét nghiệm 04',purpose: 'Kiểm tra 04', specimenNumber: '2', description: 'Mô tả 4...' },
                {id: 5, typeTest: 'ME07', department: 'Xét nghiệm 05',purpose: 'Kiểm tra 05', specimenNumber: '7', description: 'Mô tả 5...' },
                {id: 6, typeTest: 'ME08', department: 'Xét nghiệm 06',purpose: 'Kiểm tra 06', specimenNumber: '14', description: 'Mô tả 6...' },
                {id: 7, typeTest: 'ME09', department: 'Xét nghiệm 07',purpose: 'Kiểm tra o7', specimenNumber: '10', description: 'Mô tả 7...' }
            ], totalElements: 7};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editLabs(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                    field: 'typeTest',
                    title: 'Loại xét nghiệm',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'department',
                    title: 'Phòng xét nghiệm',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'purpose',
                    title: 'Tên mục đích',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'specimenNumber',
                    title: 'Số mẫu thử',
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