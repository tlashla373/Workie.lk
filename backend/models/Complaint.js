const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    // Who filed the complaint
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // What is being reported
    reportedContent: {
        contentType: {
            type: String,
            enum: ['post', 'user', 'job', 'review', 'message'],
            required: true
        },
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'reportedContent.contentModel'
        },
        contentModel: {
            type: String,
            required: true,
            enum: ['Post', 'User', 'Job', 'Review', 'Message']
        }
    },

    // Who/what is being reported (the owner of the content)
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Complaint details
    reason: {
        type: String,
        required: true,
        enum: [
            'spam',
            'harassment',
            'inappropriate',
            'fake-info',
            'copyright',
            'scam',
            'hate-speech',
            'violence',
            'illegal-content',
            'privacy-violation',
            'other'
        ]
    },

    customReason: {
        type: String,
        maxlength: [500, 'Custom reason cannot exceed 500 characters']
    },

    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },

    // Additional context
    category: {
        type: String,
        enum: ['content', 'behavior', 'fraud', 'legal', 'other'],
        default: 'content'
    },

    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'under-review', 'resolved', 'dismissed', 'escalated'],
        default: 'pending'
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    // Admin handling
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Admin who is handling this complaint
    },

    adminNotes: [{
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        note: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],

    // Resolution details
    resolution: {
        action: {
            type: String,
            enum: ['no-action', 'warning', 'content-removed', 'user-suspended', 'user-banned', 'other']
        },
        details: String,
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        resolvedAt: Date
    },

    // Evidence/attachments
    evidence: [{
        type: {
            type: String,
            enum: ['screenshot', 'url', 'file', 'text']
        },
        data: String, // URL or file path or text content
        description: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Tracking
    isResolved: {
        type: Boolean,
        default: false
    },

    reviewedAt: Date,

    // IP and device info for tracking
    reporterInfo: {
        ipAddress: String,
        userAgent: String,
        deviceInfo: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
complaintSchema.index({ reporter: 1, createdAt: -1 });
complaintSchema.index({ reportedUser: 1, createdAt: -1 });
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ 'reportedContent.contentType': 1, 'reportedContent.contentId': 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ assignedTo: 1, status: 1 });

// Virtual for getting the reported content
complaintSchema.virtual('reportedContentDetails', {
    ref: function () {
        return this.reportedContent.contentModel;
    },
    localField: 'reportedContent.contentId',
    foreignField: '_id',
    justOne: true
});

// Static method to get complaint statistics
complaintSchema.statics.getStatistics = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const reasonStats = await this.aggregate([
        {
            $group: {
                _id: '$reason',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    return {
        byStatus: stats,
        byReason: reasonStats
    };
};

// Instance method to resolve complaint
complaintSchema.methods.resolve = function (action, details, adminId) {
    this.status = 'resolved';
    this.isResolved = true;
    this.resolution = {
        action,
        details,
        resolvedBy: adminId,
        resolvedAt: new Date()
    };
    this.reviewedAt = new Date();

    return this.save();
};

// Pre-save middleware to set priority based on reason
complaintSchema.pre('save', function (next) {
    if (this.isNew) {
        // Set priority based on reason
        const urgentReasons = ['violence', 'illegal-content', 'hate-speech'];
        const highReasons = ['harassment', 'scam', 'privacy-violation'];
        const mediumReasons = ['inappropriate', 'fake-info'];

        if (urgentReasons.includes(this.reason)) {
            this.priority = 'urgent';
        } else if (highReasons.includes(this.reason)) {
            this.priority = 'high';
        } else if (mediumReasons.includes(this.reason)) {
            this.priority = 'medium';
        } else {
            this.priority = 'low';
        }
    }
    next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;