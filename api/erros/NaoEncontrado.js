class NaoEncontrado extends Error {
  constructor() {
    super('Não encontrado')
    this.name = 'NaoEncontrado'
    this.idError = 0
  }
}

module.exports = NaoEncontrado
