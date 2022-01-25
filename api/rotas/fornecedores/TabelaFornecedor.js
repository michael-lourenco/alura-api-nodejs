const Modelo = require('./ModeloTabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')

module.exports = {
    listar() {
        return Modelo.findAll()
    },
    inserir(fornecedor) {
        return Modelo.create(fornecedor)
    },
    async pegarPorId(id) {
        const encontrado = Modelo.findOne({
            where:{
                id
            }
        })

        if(!encontrado) {
            throw new NaoEncontrado()
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
