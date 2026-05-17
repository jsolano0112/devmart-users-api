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
                    bat '''
                echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin || exit /b 1
                docker push %IMAGE_NAME%:%BUILD_NUMBER% || exit /b 1
                docker push %IMAGE_NAME%:latest || exit /b 1
                docker logout
            '''
        }
            }
        }

        stage('Limpiar') {
            steps {
                bat 'docker rmi %IMAGE_NAME%:%BUILD_NUMBER% || true'
            }
        }
    }

    post {
        success { echo '✅ %IMAGE_NAME%:%BUILD_NUMBER% publicado en DockerHub' }
        failure { echo '❌ Falló el pipeline' }
    }
}
