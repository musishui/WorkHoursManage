$(document).ready(function () {
    var user = common.getCurrUser();
    var workItemRactive = new Ractive({
        el: '#workItemModal',
        template: '#workItemTemplate',
        data: {
            workItem: {}
        }
    });
    workItemRactive.on({
        save: function () {
            var workItem = workItemRactive.get('workItem');
            $.post('/api/works/' + (workItem._id || ''), workItem).then(
                function (obj) {

                    workItemRactive.set('workItem.content', '');
                    if (obj.result == 0) {
                        updateCalendar(obj.data);
                    }
                    if (workItem._id) {
                        $('#workItemModal').modal('hide');
                    }
                }, 
                function (err) {
                    console.log(err);
                })
        }
    });

    common.getProjects().then(function (projects) {
        workItemRactive.set('projects', projects);
    });
    common.getWorkTypes().then(function (workTypes) {
        workItemRactive.set('workTypes', workTypes);
    });
    
    renderCalendar();

    function renderCalendar() {
        $('#calendar').fullCalendar({
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
                // 新增任务
                
                showWorkItemDialog({ start: start });
            },
            buttonIcons: false, // show the prev/next text
            weekNumbers: true,
            eventClick: function (calEvent, jsEvent, view) {
                if ($(jsEvent.target).hasClass('event-cls')) {
                    // 删除
                    $.ajax({
                        type: 'delete',
                        url: '/api/works/' + calEvent.id,
                        dataType: 'json'
                    }).then(function () {
                        $("#calendar").fullCalendar("removeEvents", calEvent._id);
                    }, function (err) { 
                    })
                }
                else {
                    // 编辑
                    showWorkItemDialog(calEvent);
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
            events: function (start, end, timezone , callback) {
                getWorkItems(start._d, end._d).then(function (events) {
                    callback(events)
                })
            }
        });
    }
    
    function getWorkItems(start, end) {
        if (!user) return;
        return $.get('/api/works/', { userIds: [user._id], start: start, end: end }).then(function (obj) {
            if (obj.result == 0 && obj.data) {
                return obj.data.map(function (item) {
                    return convertToEvent(item);
                });
            }
        });
    }
    
    function showWorkItemDialog(calEvent) {
        calEvent = $.extend(true, {
            data: {
                _id: null,
                content: '',
                workday: calEvent.start._d,
                userId: user._id,
                hours: 8,
                progress: 100
            }
        }, calEvent);
        var workItem = $.extend(true, workItemRactive.get('workItem'), calEvent.data);
        workItemRactive.set('workItem', workItem);
        $('#workItemModal').modal('show');
    }
    
    function updateCalendar(workItem) {
        $("#calendar").fullCalendar("refetchEvents");
    }
    
    function convertToEvent(workItem) {
        return {
            id: workItem._id,
            title: workItem.content,
            start: workItem.workday,
            data: workItem
        };
    }

});
function logout() { 
    common.logout();
}