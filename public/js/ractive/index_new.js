$(document).ready(function () {
    var user = common.getCurrUser(),
        projects = [],
        workType = [],
        events = [];
    
    var workItemRactive = new Ractive({
        el: '#workItems',
        template: '#workItemTemplate',
        data: {
            workItem: {}
        }
    });
    workItemRactive.on({
        save: function () {
            if (!validateData()) return;
            
            var workItem = workItemRactive.get('workItem');
            
            return;
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
                });
        }
    });
    
    common.getProjects().then(function (data) {
        data.forEach(function (item) {
            item.py = pinyin.getCamelChars(item.name);
        });
        projects = data;
    });
    
    common.getWorkTypes().then(function (data) {
        data.forEach(function (item) {
            item.py = pinyin.getCamelChars(item.name);
        });
        workTypes = data;
    });
    
    var $workType = $('#selWorkType'),
        $project = $('#selProject');
    
    buildAutoComplete($project);
    buildAutoComplete($workType);
    
    renderCalendar();
    
    function buildAutoComplete($dom, dataSource) {
        $dom.autocomplete({
            source: function (query, process) {
                query = _.trim(query);
                var regs = _.map(query, function (ch) { return _.escapeRegExp(ch); }),
                    regex = new RegExp('.*' + regs.join('.*') + '.*', 'i');
                var items = [];
                dataSource.forEach(function (item) {
                    if (regex.test(item.name + item.py)) {
                        items.push(item);
                    }
                });
                return items;
            },
            formatItem: function (item) {
                return item["name"];
            },
            highlighter: function (item) { return item.name },
            setValue: function (item) {
                return { 'data-value': item["name"], 'real-value': item["_id"] };
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
            firstDay: 0,
            editable: false,
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
                    if (!confirm('确定删除工时吗？')) return;
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
            eventLimit: true, // allow "more" link when too many events
            events: function (start, end, timezone , callback) {
                getWorkItems(start._d, end._d).then(function (data) {
                    callback(data)
                });
            }
        });
    }
    
    function getWorkItems(start, end) {
        if (!user) return;
        return $.get('/api/works/', { userIds: [user._id], start: start, end: end }).then(function (obj) {
            if (obj.result == 0 && obj.data) {
                events = obj.data;
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
            data: workItem,
            allDay: true
        };
    }
    
    function validateData() {
        var result = true;
        $('#frmWorkItem input.form-control').each(function () {
            if (!this.checkValidity()) {
                setError($(this));
            }
        });
        var workTypeId = validateAutoComplete($workType, workTypes);
        workItemRactive.set('workItem.workTypeId', workTypeId);
        
        var projectId = validateAutoComplete($project, projects);
        workItemRactive.set('workItem.projectId', projectId);
        
        return result;
        
        function setError($dom) {
            result = false;
            $dom.addClass('error').one('focus', function () {
                $dom.removeClass('error');
            });
        }
        
        function validateAutoComplete($dom, source) {
            var text = $dom.val(),
                id = $dom.attr('real-value');
            if (text != $dom.attr('data-value')) {
                var item = _.find(source, { name: text });
                if (item) {
                    id = item._id;
                } else {
                    setError($dom);
                }
            }
            return id;
        }
    }
});
// 注销
function logout() {
    common.logout();
}