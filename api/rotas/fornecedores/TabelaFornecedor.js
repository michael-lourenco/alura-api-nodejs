const Modelo = require('./ModeloTabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')

module.exports = {
    listar() {
        return Modelo.findAll({ raw: true })
    },
    inserir(fornecedor) {
        return Modelo.create(fornecedor)
    },
    async pegarPorId(idFornecedor) {
        const encontrado = await Modelo.findOne({
            where:{
                id: idFornecedor
            },
            raw: true
        })

        if(!encontrado) {
            throw new NaoEncontrado('fornecedor')
        }

        return encontrado;
    },
    atualizar(id, dadosParaAtualizar) {
        return Modelo.update(dadosParaAtualizar, {
            where: {
                id
            }
        })
    },
    remover(id) {
        return Modelo.destroy({
            where: {
                id
            }
        })
    }
}
