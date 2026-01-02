import express, { type Request, type Response } from 'express'
import { getQuote } from './utils/getQuote.js';
import {connectDB} from './config/db.js'
import { userRouter } from './services/user.js';
const PORT = process.env.PORT || 3000
const app = express();
app.use(express.json());
connectDB();
app.get('/', (req: Request, res: Response) => {
    res.status(200).json('Backend is running again ')
})
app.use('/user', userRouter)
app.get('/quote', async (req: Request, res: Response) => {
    try {
        const quote = await getQuote()
        console.log("Quote: ", quote)
        if (!quote) {
            return res.status(404).json("No quote found")
        }
        res.status(200).json(quote)
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: "Failed to fetch quote" })
    }
})
app.listen(PORT, () => {
    console.log(`Server is runnig on PORT ${PORT}`)
})