import express, {} from 'express';
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).json('Backend is running again ');
});
app.listen(PORT, () => {
    console.log(`Server is runnig on PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map