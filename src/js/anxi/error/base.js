export class AnxiError extends Error {
    errorType = 'baseanxierror'
    constructor(message) {
        super(message);
    }
}
export class AlreadyDoneError extends AnxiError {
    errorType = 'alreadydone'
    constructor(){
        super(...arguments);
    }
}