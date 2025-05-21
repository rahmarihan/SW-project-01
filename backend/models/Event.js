const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    description: String,
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: String,
    image: String,
    ticketPrice: {
        type: Number,
        required: true,
        min: 0
    },
    totalTickets: {
        type: Number,
        required: true,
        min: 1
    },
    remainingTickets: {
        type: Number,
        required: true,
        min: 0,
        default: function() { return this.totalTickets },
        validate: {
            validator: function(value) {
                return value <= this.totalTickets;
            },
            message: 'Remaining tickets cannot exceed total tickets'
        }
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'declined'],
        default: 'pending'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Pre-save hook to ensure remainingTickets doesn't exceed totalTickets
eventSchema.pre('save', function(next) {
    if (this.remainingTickets > this.totalTickets) {
        this.remainingTickets = this.totalTickets;
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);
