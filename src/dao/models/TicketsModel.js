const { mongoose } = require("mongoose");
const { config } = require("../../config/config");

// coleccion de users
const ticketsColl = config.MONGO_COLLTICKTNAME;

// esquema para users
const ticketsSchema = new mongoose.Schema(
    {       
        code: { type: String, required: true, unique: true, default: () => `TCKT-${Date.now()}-${Math.floor(Math.random() * 1000)}` },
        purchase_datetime: { type: Date, default: Date.now },
        amount: { type: Number, required: true },
        purchaser: { type: String, required: true }
    },
    {
        timestamps: true,
        //strict: false, 
    }
)

const TicketsModel = mongoose.model(
    ticketsColl,
    ticketsSchema,
)

module.exports = { TicketsModel };