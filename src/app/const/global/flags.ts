const noUsername = 'no_username'
const noPassword = 'no_password'

if (process.env.npm_config_ENV_TO_CHECK == null) {
    process.argv.forEach((data) => {
        if (!data.startsWith('--')) return

        const [key, value] = data.split('=')

        process.env[`npm_config_${key.slice(2)}`] = value == undefined ? 'true' : value === 'false' ? undefined : value
    })
}

export const SCREENSHOT = process.env.npm_config_SCREENSHOT
export const DEBUG = process.env.npm_config_debug
export const CHECK = process.env.npm_config_CHECK
export const ENV_TO_CHECK = process.env.npm_config_ENV_TO_CHECK
export const BUILD_NUMBER = process.env.npm_config_BUILD_NUMBER
export const DYN_USERNAME = process.env.npm_config_DYN_USERNAME ? process.env.npm_config_DYN_USERNAME : noUsername
export const DYN_PASSWORD = process.env.npm_config_DYN_PASSWORD ? process.env.npm_config_DYN_PASSWORD : noPassword
export const SOAP_USERNAME = process.env.npm_config_SOAP_USERNAME ? process.env.npm_config_SOAP_USERNAME : noUsername
export const SOAP_PASSWORD = process.env.npm_config_SOAP_PASSWORD ? process.env.npm_config_SOAP_PASSWORD : noPassword
