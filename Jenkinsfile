def properties
String preparation = "src/app/config/jenkins/preparation.sh"
String tests = "src/app/config/jenkins/tests.sh"
String emailContent = "src/app/config/jenkins/email-content.sh"
String attachments = "src/app/config/jenkins/attachments.sh"

pipeline {
    agent any
    parameters {
        string defaultValue: 'DEV', description: 'specifies environment to check', name: 'ENV_TO_CHECK', trim: false
        string defaultValue: 'TEST', description: 'possible values: "UI, API, REST, SOAP, SPEC, TEST" (TEST=all)', name: 'CHECK', trim: false
        gitParameter branch: '', branchFilter: '.*', defaultValue: 'master', description: 'tests branch', name: 'BRANCH', quickFilterEnabled: false, selectedValue: 'NONE', sortMode: 'NONE', tagFilter: '*', type: 'PT_BRANCH'
        string defaultValue: '', description: 'nothing if triggered manually', name: 'PARENT_JOB_NAME', trim: false
        string defaultValue: '', description: 'nothing if triggered manually', name: 'PARENT_BUILD_NUMBER', trim: false
        string defaultValue: '', description: 'nothing if triggered manually', name: 'PARENT_GIT_PREVIOUS_COMMIT', trim: false
        string defaultValue: '', description: 'nothing if triggered manually', name: 'PARENT_GIT_COMMIT', trim: false
        booleanParam defaultValue: true, description: 'defines whether screenshot snapshots are tested', name: 'SCREENSHOT'
        booleanParam defaultValue: false, description: 'defines whether to attach failed screenshot snapshots to email', name: 'ATTACH_SCREEN'
        credentials(name: 'dynAdminUser',
                description: 'dynAdmin user to build with',
                defaultValue: 'dynAdminDev',
                credentialType: 'com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl',
                required: true)
        credentials(name: 'soapUser',
                description: 'soap user to build with',
                defaultValue: 'soapDev',
                credentialType: 'com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl',
                required: true)
    }
    stages {
        stage('clear results of previous run') {
            steps {
                sh "chmod 744 ${preparation} && ${preparation}"
            }
        }
        stage('run tests') {
            steps {
                withCredentials([usernamePassword(
                        credentialsId: '${dynAdminUser}',
                        usernameVariable: 'DYN_USERNAME',
                        passwordVariable: 'DYN_PASSWORD',
                ),
                usernamePassword(
                        credentialsId: '${soapUser}',
                        usernameVariable: 'SOAP_USERNAME',
                        passwordVariable: 'SOAP_PASSWORD',
                )]) {
                    sh "chmod 744 ${tests} && ${tests} --DYN_USERNAME='${DYN_USERNAME}' --DYN_PASSWORD='${DYN_PASSWORD}' --SOAP_USERNAME='${SOAP_USERNAME}' --SOAP_PASSWORD='${SOAP_PASSWORD}'"
                }
            }
        }
        stage('set email content') {
            steps {
                sh "chmod 744 ${emailContent} && ${emailContent}"
            }
        }
        stage('prepare email report artifacts') {
            steps {
                sh "chmod 744 ${attachments} && ${attachments}"
            }
        }
        stage('send email') {
            steps {
                script {
                    def recipientsFileFolderLocation
                    switch (ENV_TO_CHECK.toUpperCase()) {
                        case 'DEV':
                            recipientsFileFolderLocation = 'DEV'
                            break
                        case 'STAGE':
                            recipientsFileFolderLocation = 'STAGE'
                            break
                        case 'PROD':
                            recipientsFileFolderLocation = 'PROD'
                            break
                        default:
                            println "Warning! Environment is not specified. Default recipients are set up."
                            recipientsFileFolderLocation = 'DEFAULT'
                            break
                    }
                    properties = readProperties file: "src/app/config/jenkins/site/${recipientsFileFolderLocation.toLowerCase()}/recipients.properties"
                    def subjectFile = readProperties file: "subject_and_status.email"
                    properties.subject = subjectFile['EMAIL_SUBJECT']
                    properties.body = readFile file: "content.email"
                }
                emailext(
                        subject: properties['subject'],
                        body: properties['body'],
                        attachmentsPattern: 'result/email/report.zip',
                        from: properties['from'],
                        to: properties['recipients']
                )
            }
        }
    }
    post('store results') {
        always {
            junit "result/junit/report*.xml"
        }
    }
}
