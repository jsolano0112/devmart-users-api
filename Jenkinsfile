pipeline {

    agent any

    environment {
        IMAGE_NAME = 'jsolano0112/users-api'
    }

    stages {

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

        stage('Aprobación PROD') {
            when {
                branch 'main'
            }
            steps {
                input message: '¿Confirmas deploy de users-api en PROD?', ok: 'Sí, deployar'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def EC2_IP_CREDENTIAL  = env.BRANCH_NAME == 'main' ? 'prod-ec2-ip'          : 'qa-ec2-ip'
                    def SSH_KEY_CREDENTIAL = env.BRANCH_NAME == 'main' ? 'devmart-ssh-key-prod'  : 'devmart-ssh-key-qa'
                    def INFRA_BRANCH         = env.BRANCH_NAME == 'main' ? 'main'    : 'develop'

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
        success { echo "✅ users-api desplegado en ${env.BRANCH_NAME == 'main' ? 'PROD' : 'QA'}" }
        failure { echo '❌ Falló el pipeline de users-api' }
    }
}