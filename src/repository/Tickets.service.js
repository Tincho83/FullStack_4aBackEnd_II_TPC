// services/TicketsService.js
const TicketsRepository = require("../repository/TicketsRepository");

class TicketsService {
    async createNewTicket(purchaser, amount) {
        const ticketData = {
            purchaser,
            amount
        };
        return await TicketsRepository.createTicket(ticketData);
    }

    async getTicketByCode(code) {
        return await TicketsRepository.findTicketByCode(code);
    }

    async getAllTickets() {
        return await TicketsRepository.getAllTickets();
    }

    async deleteTicket(code) {
        return await TicketsRepository.deleteTicketByCode(code);
    }
}

module.exports = new TicketsService();
