const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar()
    resposta.status(200)
    const serializador = new SerializadorFornecedor(
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar(resultados)
    )
})

roteador.get('/:id', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.id
        const fornecedor = new Fornecedor({ id })
        await fornecedor.carregar()
        resposta.status(200)
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type')
        )
        resposta.send(
            serializador.serializar(fornecedor)
        )
    } catch (error) {
        proximo(error)
    }
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try {        
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        resposta.status(201)
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type')
        )
        resposta.send(serializador.serializar(fornecedor))
    } catch (error) {
        proximo(error)
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

roteador.delete('/:id', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.id
        const fornecedor = new Fornecedor({id})
        await fornecedor.carregar()
        await fornecedor.remover()
        resposta.status(204).end()
    } catch (error) {
        proximo(error)
    }
})


module.exports = roteador
