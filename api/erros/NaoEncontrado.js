class NaoEncontrado extends Error {
  constructor() {
    const mensagem = 'Não encontrado'
    super(mensagem)
    this.name = 'NaoEncontrado'
    this.idError = 0
  }
}

module.exports = NaoEncontrado
