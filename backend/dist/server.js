"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
const db_1 = __importDefault(require("./config/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser")); // Import body-parser
const cors_1 = __importDefault(require("cors"));
const port = 5050;
const app = (0, express_1.default)();
//This middleware is very imp as it parses incoming requests with JSON payloads.
//Without this we get 
//TypeError: Cannot destructure property 'name' of 'req.body' as it is undefined.
app.use(express_1.default.json({ limit: '50mb' }));
app.use((0, cors_1.default)());
app.use(express_1.default.static('public'));
//Express doesnot handle cookies so we use cokkieparser to handle cookies
app.use((0, cookie_parser_1.default)());
//The dotenv package is to use the environmental variables
dotenv_1.default.config();
(0, db_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
//It connects to apiRoutes
app.use('/api', apiRoutes_1.default);
app.get('/', (req, res) => {
    res.send('poke45');
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});
app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});
