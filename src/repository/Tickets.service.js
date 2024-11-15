const TicketsDAO = require("../dao/db/TicketsManagerMongoDB");

class TicketsService {

    constructor(DAO) {
        this.ticketsDAO = DAO;
    }

    async getTickets() {
        console.log(">Service Get Tickets:");
        return await this.ticketsDAO.getTickets();
    }

    async getTicketBy(filter = {}) {
        console.log(">Service GetBy Ticket:");
        return await this.ticketsDAO.getTicketBy(filter);
    }

    async createTicket(ticketData) {
        console.log(">Service Create Ticket:");
        return await this.ticketsDAO.createTicket(ticketData);
    }

    async deleteTicket(id) {
        console.log(">Service Delete Ticket:");
        return await this.ticketsDAO.deleteTicket(id);
    }
}

const ticketsService = new TicketsService(TicketsDAO);

module.exports = { ticketsService };