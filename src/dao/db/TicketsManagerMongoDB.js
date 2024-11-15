const { TicketsModel } = require("../models/TicketsModel");

class TicketsManagerMongoDB {

    static async getTickets() {
        console.log(">DAO Get Tickets:");
        return await TicketsModel.find().lean();
    }

    static async getTicketBy (filter = {}) {
        console.log(">DAO GetBy Ticket:");
        return await TicketsModel.findOne(filter).lean();
    }

    static async createTicket(ticketData) {
        console.log(">DAO Create Ticket:");
        let tktnew = await TicketsModel.create(ticketData);
        return tktnew.toJSON();
    }

    static async deleteTicket(id) {
        console.log(">DAO Delete Ticket:");
        return await TicketsModel.findByIdAndDelete(id, { new: true }).lean();
    }
}

module.exports = TicketsManagerMongoDB;