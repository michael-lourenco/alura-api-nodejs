const roteador = require('express').Router({ mergeParams: true });
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto

roteador.get('/', async (requisicao, resposta) => {
    const produtos = await Tabela.listar(requisicao.fornecedor.id)
    const serializador = new Serializador(
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try{
        const idFornecedor = requisicao.fornecedor.id
        const corpo = requisicao.body
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor })
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new Serializador(
            resposta.getHeader('Content-Type')
        )
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao).getTime())
        resposta.set('Last-Modified', timestamp)
        resposta.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
        resposta.status(201).send(serializador.serializar(produto))
    } catch(error) {
        proximo(error)
    }

})

roteador.delete('/:id', async (requisicao, resposta) => {
    const dados = {
        id: requisicao.params.id,
        fornecedor: requisicao.fornecedor.id
    }

    const produto = new Produto(dados)

    await produto.apagar()
    resposta.status(204).end()
})

roteador.get('/:id', async (requisicao, resposta, proximo) => {
    try{
        const dados = {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new Serializador(
            resposta.getHeader('Content-Type'),
            ['preco','estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao).getTime())
        resposta.set('Last-Modified', timestamp)
        resposta.send(serializador.serializar(produto))
    } catch(error) {
        proximo(error)
    }
})

roteador.put('/:id', async (requisicao, resposta, proximo) => {
    try{
        const id = requisicao.params.id
        const corpo = requisicao.body
        const dados = Object.assign({}, corpo, { id, fornecedor: requisicao.fornecedor.id })
        const produto = new Produto(dados)
        await produto.atualizar()
        await produto.carregar()
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao).getTime())
        resposta.set('Last-Modified', timestamp)
        resposta.status(204).end()
    } catch(error) {
        proximo(error)
    }
})

roteador.post('/:id/diminuir-estoque', async (requisicao, resposta, proximo) => {
    try{
        const id = requisicao.params.id
        const corpo = requisicao.body
        const quantidade = corpo.quantidade
        const dados = {
            id,
            fornecedor: requisicao.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        produto.estoque = produto.estoque - quantidade
        await produto.diminuirEstoque()
        await produto.carregar()
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao).getTime())
        resposta.set('Last-Modified', timestamp)
        resposta.status(204).end()
    } catch(error) {
        proximo(error)
    }
})

module.exports = roteador
