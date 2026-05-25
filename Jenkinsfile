def resolveDeployTarget() {
    def explicit = env.DEPLOY_ENV?.trim()?.toLowerCase()
    if (explicit in ['qa', 'prod']) {
        return explicit
    }

    def branch = env.BRANCH_NAME?.trim()
    if (!branch && env.GIT_BRANCH) {
        branch = env.GIT_BRANCH.replaceFirst(/^origin\//, '').trim()
    }

    if (branch == 'main') {
        return 'prod'
    }
    if (branch in ['qa', 'develop']) {
        return 'qa'
    }

    def job = env.JOB_NAME?.toLowerCase() ?: ''
    if (job.contains('prod')) {
        return 'prod'
    }
    if (job.contains('qa')) {
        return 'qa'
    }

    error("No se pudo determinar qa/prod. DEPLOY_ENV=${env.DEPLOY_ENV}, BRANCH_NAME=${env.BRANCH_NAME}, GIT_BRANCH=${env.GIT_BRANCH}, JOB_NAME=${env.JOB_NAME}")
}

pipeline {

    agent any

    environment {
        IMAGE_NAME = 'jsolano0112/users-api'
    }

    stages {

        stage('Setup') {
            steps {
                script {
                    env.DEPLOY_TARGET = resolveDeployTarget()
                    echo "Entorno detectado: ${env.DEPLOY_TARGET}"
                }
            }
        }

        stage('Build') {
            steps {
                bat """
                    docker build ^
                    -t %IMAGE_NAME%:%BUILD_NUMBER% ^
                    -t %IMAGE_NAME%:latest ^
                    .
                """
            }
        }

        stage('Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat """
                        docker login -u %DOCKER_USER% -p %DOCKER_PASS% || exit /b 1
                        docker push %IMAGE_NAME%:%BUILD_NUMBER% || exit /b 1
                        docker push %IMAGE_NAME%:latest || exit /b 1
                        docker logout
                    """
                }
            }
        }

        stage('Limpiar') {
            steps {
                bat """
                    docker rmi %IMAGE_NAME%:%BUILD_NUMBER% 2>nul
                    docker rmi %IMAGE_NAME%:latest 2>nul
                    docker image prune -f
                    exit /b 0
                """
            }
        }

        stage('Aprobacion PROD') {
            when {
                expression { env.DEPLOY_TARGET == 'prod' }
            }
            steps {
                input message: 'Confirmas deploy de users-api en PROD?', ok: 'Si, deployar'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def isProd             = env.DEPLOY_TARGET == 'prod'
                    def EC2_IP_CREDENTIAL  = isProd ? 'prod-ec2-ip'          : 'qa-ec2-ip'
                    def SSH_KEY_CREDENTIAL = isProd ? 'devmart-ssh-key-prod'  : 'devmart-ssh-key-qa'
                    def INFRA_BRANCH       = isProd ? 'main'    : 'develop'

                    withCredentials([
                        string(credentialsId: EC2_IP_CREDENTIAL, variable: 'EC2_IP'),
                        sshUserPrivateKey(credentialsId: SSH_KEY_CREDENTIAL, keyFileVariable: 'SSH_KEY')
                    ]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r
                            icacls "%SSH_KEY%" /grant:r "%USERNAME%:R"

                            ssh -o StrictHostKeyChecking=no ^
                            -i "%SSH_KEY%" ^
                            ubuntu@%EC2_IP% ^
                            "if [ ! -d /home/ubuntu/devmart-infra ]; then cd /home/ubuntu && git clone -b ${INFRA_BRANCH} https://github.com/jsolano0112/devmart-infra.git; fi && cd /home/ubuntu/devmart-infra && docker-compose pull users-api-1 && docker-compose up -d users-api-1"
                        """
                    }
                }
            }
        }
    }

    post {
        success { echo "users-api desplegado en ${env.DEPLOY_TARGET == 'prod' ? 'PROD' : 'QA'}" }
        failure { echo 'Fallo el pipeline de users-api' }
    }
}
