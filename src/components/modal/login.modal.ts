import { defaultLoginValue, defaultPasswordValue } from '@const/properties/constants'
import { defaultResponseWaitTimer } from '@const/global/timers'
import Rest from '@classes/util/rest'

const selectors = {
    modalContainer: "div[class*='signIn-root']",
    emailField: "div[class*='signIn-root'] input[name='email']",
    passField: "div[class*='signIn-root'] input[name='password']",
    submitBtn: "button[class*='signIn-buttonSignIn']",
    closeBtn: '#modalLoginCloseButton',
    forgotPassword: '#modalLoginForgotPassword',
    contactUs: '#modalLoginContactUs',
    resetPasswordInput: '#inputFieldLabelResetPassword',
    sendEmailResetPassword: '#sendEmailResetPassword',
    cancelSendEmailResetPassword: '#cancelSendEmailResetPassword',
    backToLoginFromResetPassword: '#backToLoginFromResetPassword',
}

export default class LoginModal extends Rest {
    static getSelectors = () => selectors

    async isExists() {
        await super.waitFor(selectors.modalContainer)
    }

    async isHidden() {
        await super.waitElementAbsence(selectors.closeBtn)
    }

    async typeLogin(text = defaultLoginValue) {
        await super.type(selectors.emailField, text)
    }

    async typePassword(text = defaultPasswordValue) {
        await super.type(selectors.passField, text)
    }

    async forgotPassword() {
        await super.click(selectors.forgotPassword)
    }

    async typeEmailToRecoverPassword(email = defaultLoginValue) {
        await super.type(selectors.resetPasswordInput, email)
    }

    async sendPassword(login: string) {
        await super.resolveClickWithResponse(
            selectors.sendEmailResetPassword,
            super.waitForgotPasswordResponse,
            `Failed to send forgotten password email to ${login}.`,
            0,
            defaultResponseWaitTimer * 4
        )
    }

    async backToLogin() {
        await super.click(selectors.backToLoginFromResetPassword)
    }

    async submitLogin() {
        return super.click(selectors.submitBtn)
    }
}
