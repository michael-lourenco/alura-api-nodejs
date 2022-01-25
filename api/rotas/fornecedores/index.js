const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar()
    resposta.send(
        JSON.stringify(resultados)
    )
})

roteador.get('/:id', async (requisicao, resposta) => {
    try {
        const id = requisicao.params.id
        const fornecedor = new Fornecedor({ id })
        await fornecedor.carregar()
        resposta.send(
            JSON.stringify(fornecedor)
        )
    } catch (error) {
        resposta.status(400).send(JSON.stringify({mensagem:error.message}))
    }
})

roteador.post('/', async (requisicao, resposta) => {
    const dadosRecebidos = requisicao.body
    const fornecedor = new Fornecedor(dadosRecebidos)
    await fornecedor.criar()
    resposta.send(JSON.stringify(fornecedor))
})

module.exports = roteador
