class ValorNaoSuportado extends Error {
    constructor(contentTye) {
        super(`O Content-Type ${contentTye} não é suportado`)
        this.name = 'ValorNaoSuportado'
        this.idError = 3
    }
}

module.exports = ValorNaoSuportado
