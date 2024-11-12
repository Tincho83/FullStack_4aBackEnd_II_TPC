const { TicketsModel } = require("../models/TicketsModel");

class TicketsManagerMongoDB {

    static async getTickets() {
        return await TicketsModel.find().lean();
    }

    static async getTicketBy (filter = {}) {
        return await TicketsModel.findOne(filter).lean();
    }

    static async createTicket(ticketData) {
        let tktnew = await TicketsModel.create(ticketData);
        return tktnew.toJSON();
    }

    static async deleteTicket(id) {
        return await TicketsModel.findByIdAndDelete(id, { new: true }).lean();
    }
}

module.exports = TicketsManagerMongoDB;