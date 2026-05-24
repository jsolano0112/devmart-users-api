pipeline {

    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['qa', 'prod'],
            description: 'Ambiente de despliegue'
        )
    }

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
                        docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                        docker push %IMAGE_NAME%:%BUILD_NUMBER%
                        docker push %IMAGE_NAME%:latest
                        docker logout
                    """
                }
            }
        }

        stage('Limpiar') {
            steps {
                bat "docker rmi %IMAGE_NAME%:%BUILD_NUMBER% 2>nul & exit /b 0"
            }
        }

        stage('Deploy QA') {
            when {
                expression { params.ENVIRONMENT == 'qa' }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'qa-ec2-ip', variable: 'EC2_HOST'),
                    sshUserPrivateKey(
                        credentialsId: 'devmart-ssh-key-qa',
                        keyFileVariable: 'SSH_KEY'
                    )
                ]) {
                    bat """
                        ssh -o StrictHostKeyChecking=no ^
                        -i "%SSH_KEY%" ^
                        ubuntu@%EC2_HOST% ^
                        "cd /home/ubuntu/devmart-infra && docker compose pull users-api-1 && docker compose up -d users-api-1"
                    """
                }
            }
        }

        stage('Deploy PROD') {
            when {
                expression { params.ENVIRONMENT == 'prod' }
            }
            steps {
                input message: '¿Confirmas deploy en PROD?', ok: 'Sí, deployar'

                withCredentials([
                    string(credentialsId: 'prod-ec2-ip', variable: 'EC2_HOST'),
                    sshUserPrivateKey(
                        credentialsId: 'devmart-ssh-key-prod',
                        keyFileVariable: 'SSH_KEY'
                    )
                ]) {
                    bat """
                        ssh -o StrictHostKeyChecking=no ^
                        -i "%SSH_KEY%" ^
                        ubuntu@%EC2_HOST% ^
                        "cd /home/ubuntu/devmart-infra && docker compose pull users-api-1 && docker compose up -d users-api-1"
                    """
                }
            }
        }
    }

    post {
        success { echo "✅ users-api desplegado en ${params.ENVIRONMENT}" }
        failure { echo "❌ Falló el pipeline de users-api" }
    }
}