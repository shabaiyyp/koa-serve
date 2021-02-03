const apiTemplate = (data, message = 'success') => {
  return {
    code: 200,
    message,
    data: {
      ...data,
      message
    }
  }
}
const apiTemplateError = (message = 'error') => {
  return {
    code: 400,
    message,
  }
}
module.exports = {
  apiTemplate,
  apiTemplateError
}