(function () {
    'use strict';

    angular.module('EQA.Dictionary').service('SkillsService', SkillsService);

    SkillsService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function SkillsService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

        self.getTableDefinition = getTableDefinition;
        self.getSkills = getSkills;
        function getSkills() {
            var results = {content: [
                {id: 1, code: 'XN01', name: 'Xét nghiệm Huyết Học 01', description: 'Mô tả...' },
                {id: 2, code: 'XN02', name: 'Xét nghiệm Huyết Học 02', description: 'Mô tả...' },
                {id: 3, code: 'XN03', name: 'Xét nghiệm Huyết Học 03', description: 'Mô tả...' },
                {id: 4, code: 'XN04', name: 'Xét nghiệm Huyết Học 04', description: 'Mô tả...' },
                {id: 5, code: 'XN05', name: 'Xét nghiệm Huyết Học 05', description: 'Mô tả...' },
                {id: 6, code: 'XN06', name: 'Xét nghiệm Huyết Học 06', description: 'Mô tả...' },
                {id: 7, code: 'XN07', name: 'Xét nghiệm Huyết Học 07', description: 'Mô tả...' }
            ], totalElements: 7};

            return $q.when(results);
        }

        function getTableDefinition() {

            var _tableOperation = function (value, row, index) {
                return '<a class="green-dark margin-right-20" href="#" data-ng-click="$parent.editSkills(' + "'" + row.id + "'" + ')"><i class="icon-pencil margin-right-5"></i>Sửa</a>';
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
                    title: 'Mã chuyên môn',
                    sortable: true,
                    switchable: false,
                    cellStyle: _cellNowrap
                }
                , {
                    field: 'name',
                    title: 'Tên chuyên môn',
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