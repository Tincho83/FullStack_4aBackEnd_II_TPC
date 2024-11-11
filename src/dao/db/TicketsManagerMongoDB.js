// dao/TicketsManager.js
const { TicketsModel } = require("../models/TicketsModel");

class TicketsManager {
    async create(ticketData) {
        return await TicketsModel.create(ticketData);
    }

    async getByCode(code) {
        return await TicketsModel.findOne({ code });
    }

    async getAll() {
        return await TicketsModel.find({});
    }

    async deleteByCode(code) {
        return await TicketsModel.findOneAndDelete({ code });
    }
}

module.exports = new TicketsManager();