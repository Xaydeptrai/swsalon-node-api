const httpResponse = require('../helpers/http-response')
const { InvalidParamError, MissingParamError } = require('../../utils/errors')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return httpResponse.badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return httpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return httpResponse.badRequest(new MissingParamError('password'))
      }
      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return httpResponse.unauthorizedError()
      }
      return httpResponse.ok({ accessToken })
    } catch (error) {
      return httpResponse.serverError()
    }
  }
}
