import express from 'express';

const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/sorteo', (req, res) => {
    console.log(req.body);
})

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000' + "http://localhost:3000" );
});