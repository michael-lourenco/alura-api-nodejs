const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')

roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar()
    resposta.status(200).send(
        JSON.stringify(resultados)
    )
})

roteador.get('/:id', async (requisicao, resposta) => {
    try {
        const id = requisicao.params.id
        const fornecedor = new Fornecedor({ id })
        await fornecedor.carregar()
        resposta.status(200).send(
            JSON.stringify(fornecedor)
        )
    } catch (error) {
        resposta.status(404).send(JSON.stringify({mensagem:error.message}))
    }
})

roteador.post('/', async (requisicao, resposta) => {
    try {        
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        resposta.status(201).send(JSON.stringify(fornecedor))
    } catch (error) {
        resposta.status(400).send(JSON.stringify({mensagem:error.message}))
    }
})

roteador.put('/:id', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.id
        const dados = requisicao.body
        const payload = Object.assign({}, dados, { id })
        const fornecedor = new Fornecedor(payload)

        await fornecedor.atualizar()
        resposta.status(204).end()
    } catch (error) {
        proximo(error)
    }
})

roteador.delete('/:id', async (requisicao, resposta) => {
    try {
        const id = requisicao.params.id
        const fornecedor = new Fornecedor({id})
        await fornecedor.carregar()
        await fornecedor.remover()
        resposta.status(204).end()
    } catch (error) {
        resposta.status(404).send(JSON.stringify({mensagem:error.message}))
    }
})


module.exports = roteador
