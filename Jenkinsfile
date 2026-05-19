pipeline {
    agent any

    environment {
        IMAGE_NAME = 'jsolano0112/users-api'
    }

    stages {
          stage('Build') {
            steps {
                withCredentials([
                    string(credentialsId: 'jwt-secret',         variable: 'JWT_SECRET'),
                    string(credentialsId: 'jwt-refresh-secret', variable: 'JWT_REFRESH_SECRET'),
                    string(credentialsId: 'mongo-db-username',  variable: 'DB_USERNAME'),
                    string(credentialsId: 'mongo-db-password',  variable: 'DB_PASSWORD')
                ]) {
                    bat '''
                        docker build ^
                        --build-arg JWT_SECRET=%JWT_SECRET% ^
                        --build-arg JWT_REFRESH_SECRET=%JWT_REFRESH_SECRET% ^
                        --build-arg JWT_EXPIRE_IN=15m ^
                        --build-arg JWT_REFRESH_EXPIRE_IN=20m ^
                        --build-arg DB_USERNAME=%DB_USERNAME% ^
                        --build-arg DB_PASSWORD=%DB_PASSWORD% ^
                        -t %IMAGE_NAME%:%BUILD_NUMBER% ^
                        -t %IMAGE_NAME%:latest ^
                        .
                    '''
                }
            }
        }

        stage('Push a DockerHub') {
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
                bat 'docker rmi %IMAGE_NAME%:%BUILD_NUMBER% 2>nul & exit /b 0'
            }
        }

       stage('Deploy en EC2') {
            steps {
                    withCredentials([
                    string(credentialsId: 'devmart-ec2-ip', variable: 'EC2_IP'),
                    sshUserPrivateKey(
                        credentialsId: 'devmart-ssh-key',
                        keyFileVariable: 'SSH_KEY'
                    )
                ]) {
                    bat '''
                        icacls "%SSH_KEY%" /inheritance:r
                        icacls "%SSH_KEY%" /grant:r "%USERNAME%:R"
                        ssh -o StrictHostKeyChecking=no -i "%SSH_KEY%" ubuntu@%EC2_IP% "cd /home/ubuntu/devmart-infra && docker-compose pull users-api-1 && docker-compose up -d users-api-1"
                    '''
                }
            }
        }
    }

    post {
        success { echo '✅ users-api desplegado en EC2' }
        failure { echo '❌ Falló el pipeline' }
    }
}