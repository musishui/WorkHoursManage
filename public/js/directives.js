'use strict';
var directives = angular.module('directives', []);

directives.directive('', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div></div>',
        link: function (scope, element, attrs){
            element.fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month' //month,basicWeek,basicDay,agendaWeek,agendaDay
                },
                defaultDate: new Date(),
                lang: 'zh-cn',
                selectable: true,
                selectHelper: true,
                select: function (start, end) {
                    var tspan = end - start;
                    if (tspan > 1000 * 60 * 60 * 24) { return; }//暂时限制单天
                    //新增任务
                    showNewDialog(start, end);
                },
                buttonIcons: false, // show the prev/next text
                weekNumbers: true,
                eventClick: function (calEvent, jsEvent, view) {
                    
                    if ($(jsEvent.target).hasClass('event-cls')) {
                        //删除
                        $("#calendar").fullCalendar("removeEvents", calEvent._id);
                    }
                    else {
                        //添加
                        $('#exampleModal').modal('show');
                        $('#txtName').val(calEvent.title);
                    }
                },
                eventMouseover: function (calEvent, jsEvent, view) {
                    var e = jsEvent;
                    var evt = $(e.target);
                    if (!evt.hasClass('fc-day-grid-event')) {
                        evt = evt.parents('.fc-day-grid-event');
                    }
                    evt.append($('<i class="fa fa-close event-cls" >'));

                },
                eventMouseout: function (calEvent, jsEvent, view) {
                    var e = jsEvent;
                    var evt = $(e.target);
                    if (!evt.hasClass('fc-day-grid-event')) {
                        evt = evt.parents('.fc-day-grid-event');
                    }
                    evt.find(".event-cls").remove();
                },
                editable: true,
                eventLimit: true, // allow "more" link when too many events
                events: data


            });
        }
        }
    }
})



