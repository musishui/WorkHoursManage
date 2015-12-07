var mongoose = require('./dbHelper.js').mongoose,
    util = require('util'),
    Schema = mongoose.Schema;

/**
 * Schema
 */
function BaseSchema() {
    Schema.apply(this, arguments);
    
    this.add({
        createTime: {
            type: Date,
            default: Date.now
        },
        isDel: {
            type: Boolean,
            default: false
        },
        comment: {
            type: String
        }
    });
}

util.inherits(BaseSchema, Schema);

function EnumSchema() {
    BaseSchema.apply(this, arguments);
    
    this.all = [];
    
    this.add({
        name: { type: String }
    });
    
    this.post('save', function (doc) {
        
        console.log('save');
    });
    
    this.post('update', function (doc) {
        console.log('update');
    });
    
    this.post('remove', function (doc) {
        console.log('remove');
    });
    
    this.static('getAll', (function () {
        var all;
        return function () {
            
        }
    }));
}

util.inherits(EnumSchema, BaseSchema);

var Team = new EnumSchema(),
    User = new BaseSchema({
        name: {
            type: String,
            unique: true
        },
        displayName: {
            type: String
        },
        password: {
            type: String
        },
        teamId: {
            type: Schema.Types.ObjectId,
            ref: 'team'
        }
    }),
    Project = new EnumSchema({
        status: {
            type: Number
        }
    }),
    WorkType = new EnumSchema({
        _id: {
            type: Number,
            unique: true
        }
    }),
    WorkItem = new BaseSchema({
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'project'
        },
        workType: {
            type: Number,
            ref: 'workType'
        },
        hours: {
            type: Number,
            min: 1
        },
        progress: {
            type: Number,
            min: 1,
            max: 100
        },
        content: {
            type: String
        }
    }),
    Work = new BaseSchema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        workday: {
            type: Date
        },
        status: {
            type: Number
        },
        workItems: [WorkItem]
    });

module.exports = {
    Team: mongoose.model('Team', Team),
    User: mongoose.model('User', User),
    Project: mongoose.model('Project', Project),
    WorkType: mongoose.model('WorkType', WorkType),
    Work: mongoose.model('Work', Work)
}

