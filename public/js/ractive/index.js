$(document).ready(function () {
    var uid = '803d4de2-afa1-4f92-b51e-b7d602fb33cc';
    var loginRactive = new Ractive({
        el: '#loginModal',
        template: '#loginTemplate'
    });
    loginRactive.on({
        login: function () {
            var data = loginRactive.get();
            login(data.user, data.rememberPwd).then(function (obj) {
                if (obj.result == 0) {
                    $('#loginModal').modal('hide');
                } else if (obj.result == 1) {
                    alert('用户名或密码错误');
                } else {
                    alert('系统异常');
                }
            });
        }
    });
    
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
                    if (obj.result == 0) {
                        updateCalendar(obj.data);
                    }
                }, 
                function (err) {
                    console.log(err);
                })
        }
    })
    
    var user = Cookies.get(uid);
    if (user) {
        user = JSON.parse(user);
    }
    $.when(!user || login(user)).then(function () {
        if (!user) {
            $('#loginModal').modal('show');
        }
    });
    
    common.getProjects().then(function (projects) {
        workItemRactive.set('projects', projects);
    });
    common.getWorkTypes().then(function (workTypes) {
        workItemRactive.set('workTypes', workTypes);
    });
    
    function login(u, rememberPwd) {
        return $.get('/api/login', u).then(function (obj) {
            if (obj.result == 0) {
                // 记住密码
                user = obj.data;
                renderCalendar();
                return { result: 0 };
            } else {
                user = null;
                return { result: 1 };
            }

        }, function (err) {
            console.log(err);
            return { result: 2 };
        }).always(function (obj) {
            if (obj.result == 0 && rememberPwd !== false) {
                Cookies.set(uid, u);
            } else {
                Cookies.remove(uid);
            }
            if (obj.result == 0) {
                common.setStorage('user', user);
            } else {
                common.removeStorage('user', user);
            }
        });
    }
    
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