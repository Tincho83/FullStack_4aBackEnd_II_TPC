const TicketsDAO = require("../dao/db/TicketsManagerMongoDB");

class TicketsService {

    constructor(DAO) {
        this.ticketsDAO = DAO;
    }

    async getTickets() {
        console.log("... Tickets Service");
        return await this.ticketsDAO.getTickets();
    }

    async getTicketBy(filter = {}) {        
        return await this.ticketsDAO.getTicketBy(filter);
    }

    async createTicket(ticketData) {
    //async createTicket(purchaser, amount) {
        // const ticketData = { purchaser, amount };
        //return await TicketsRepository.createTicket(ticketData);
        return await this.ticketsDAO.createTicket(ticketData);
    }

    async deleteTicket(id) {
        return await this.ticketsDAO.deleteTicket(id);
    }
}

const ticketsService = new TicketsService(TicketsDAO);

module.exports = { ticketsService };