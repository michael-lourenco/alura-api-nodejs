const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos

app.use(bodyParser.json())

app.use((requisicao, resposta, proximo) => {
    let  formatoRequisitado = requisicao.header('Accept')

    if(formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json'
    }

    if(formatosAceitos.indexOf(formatoRequisitado) === -1){
        resposta.status(406)
        resposta.end()
        return
    }

    resposta.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

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

    if(error instanceof ValorNaoSuportado) {
        status = 406
    }

    resposta.status(status)
    resposta.send(JSON.stringify({
        mensagem: error.message,
        id: error.idError
    }))
})

app.listen(config.get('api.porta'), () => console.log('Server is running on port 3000'))
