const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')

app.use(bodyParser.json())

const roteador = require('./rotas/fornecedores')

app.use('/api/fornecedores', roteador)

app.use((error, requisicao, resposta, proximo) =>{
    let status = 500

    if(error instanceof NaoEncontrado) {
        status = 404
    }

    if(error instanceof CampoInvalido || error instanceof DadosNaoFornecidos) {
        status = 400
    }

    resposta.status(status)
    resposta.send(JSON.stringify({
        mensagem: error.message,
        id: error.idError
    }))
})

app.listen(config.get('api.porta'), () => console.log('Server is running on port 3000'))
