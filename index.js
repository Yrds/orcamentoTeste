const express = require('express');
const app = express();

const db = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./db.sqlite"
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.delete('/ingrediente/:id', function (req, res) {
    db('ingrediente').where({ id: req.params.id }).delete().then(res.end);
})

app.delete('/prato/:id', function (req, res) {
    db('prato').where({ id: req.params.id }).delete().then(() => {
        db('prato_ingrediente').where({ id_prato: req.params.id }).delete().then(res.end);
    });
})

app.post('/ingrediente', function (req, res) {
    db('ingrediente').insert([req.body]).then((value) => res.send(value)).catch(err => console.error(err));
})

app.post('/prato', function (req, res) {
    const prato = req.body;
    db('prato').insert({ nome: prato.nome }).then((id) => {
        const arr = prato.ingredientes.map((el) => ({
            id_prato: id[0], id_ingrediente: el.id, quantidade: el.quantidade
        }));
        db('prato_ingrediente').insert(arr).then((value) => {
            res.send(value)
        })
    })
})

app.get('/prato', function (req, res) {
    db('prato')
        .select(
            'prato.id',
            'prato.nome',
            'ingrediente.id as id_ingrediente',
            'ingrediente.nome as nome_ingrediente',
            'ingrediente.preco_por_unidade as preco_por_unidade_ingrediente',
            'prato_ingrediente.quantidade as quantidade_ingrediente',
        )
        .leftJoin('prato_ingrediente', 'prato.id', 'id_prato')
        .leftJoin('ingrediente','prato_ingrediente.id_ingrediente', 'ingrediente.id')
        .then((value) => {
            res.json(value);
            res.end();
        });

})

app.get('/ingrediente', function (req, res) {
    db('ingrediente').select().then((value) => {
        res.json(value);
        res.end();
    });
})

app.listen(3000, function () {
    console.log('App de Exemplo escutando na porta 3000!');
});
