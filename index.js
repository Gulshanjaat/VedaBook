const express = require("express")
const cors = require("cors");
const connectedDatabase = require("./src/config/db")
const router = require("./src/routes/UserRouts/userrouts")
const chatRouter = require("./src/routes/UserRouts/chatRoutes")
const pdfRouter = require("./src/routes/UserRouts/pdfRouts")
const textrouter = require("./src/routes/UserRouts/textRoutes")
const planrouter = require("./src/routes/UserRouts/planRouts");
const subscriptionrouter = require("./src/routes/UserRouts/subscriptionRouts");
const PORT = 1010


const app = express()
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use("/api/user", router)
app.use("/api/chat", chatRouter);
app.use("/api/pdfs", pdfRouter);
app.use("/api/text", textrouter);
app.use( "/api/plan", planrouter);
app.use("/api/subscription",subscriptionrouter)

connectedDatabase()


app.listen(PORT, () => {
    console.log(`running at ${PORT}`)

})