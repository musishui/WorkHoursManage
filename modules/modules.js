var mongoose = require('./dbHelper.js').mongoose,
    util = require('util'),
    Q = require('q'),
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
    /*this.virtuals('id').get(function () {
        return this._id;
    }).set(function (id) {
        this._id = id;
    });*/
}

util.inherits(BaseSchema, Schema);

function EnumSchema() {
    BaseSchema.apply(this, arguments);
    var all;
    this.add({
        name: { type: String },
        index: { type: Number }
    });
    
    this.post('save', function (doc) {
        all = null;
        console.log('save');
    });
    
    this.post('update', function (doc) {
        all = null;
        console.log('update');
    });
    
    this.post('remove', function (doc) {
        all = null;
        console.log('remove');
    });
    
    this.static('getAll', function (projection) {
        var deferred = Q.defer();
        if (!all) {
            this.find({ isDel: false }, projection).then(function (doc) {
                all = doc;
                deferred.resolve(all);
            }, function (err) {
                deferred.resolve(err);
            });
        } else {
            deferred.resolve(all);
        }
        return deferred.promise;
    });
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
        },
        email: {
            type: String
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
        },
        // 是否计入工时
        isWork: {
            type: Boolean,
            default: true
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
            ref: 'User'
        },
        workday: {
            type: Date
        },
        status: {
            type: Number
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'project'
        },
        workTypeId: {
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
    });

module.exports = {
    Team: mongoose.model('Team', Team),
    User: mongoose.model('User', User),
    Project: mongoose.model('Project', Project),
    WorkType: mongoose.model('WorkType', WorkType),
    Work: mongoose.model('Work', Work)
}

