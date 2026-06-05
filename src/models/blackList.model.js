const mongoose = require('mongoose');
const { base } = require('./user.model');


const tokenblackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required to blacklist'],
        unique: [true, 'Token is already blacklisted']
    },
}, {
    timestamps: true
})

tokenblackListSchema.index(
    { createdAt: 1 }, 
    { expireAfterSeconds: 60 * 60 * 24 * 3 }
) // Index to automatically remove blacklisted tokens after 3 days

const TokenBlackListModel = mongoose.model('TokenBlackList', tokenblackListSchema);

module.exports = TokenBlackListModel;