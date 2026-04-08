pipeline {
    agent any

    environment {
        IMAGE_NAME = 'users-api'
        CONTAINER_NAME = 'users-api'
        PORT = '3001'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Construyendo imagen Docker...'
                script {
                    if (isUnix()) {
                        sh "docker build -t ${IMAGE_NAME}:latest ."
                    } else {
                        bat "docker build -t %IMAGE_NAME%:latest ."
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Desplegando contenedor...'
                script {
                    if (isUnix()) {
                        sh "docker stop ${CONTAINER_NAME} || true"
                        sh "docker rm ${CONTAINER_NAME} || true"
                        sh """
                            docker run -d \\
                                --name ${CONTAINER_NAME} \\
                                --env-file .env \\
                                -p ${PORT}:${PORT} \\
                                ${IMAGE_NAME}:latest
                        """
                    } else {
                        bat "docker stop %CONTAINER_NAME% || exit 0"
                        bat "docker rm %CONTAINER_NAME% || exit 0"
                        bat """
                            docker run -d ^
                                --name %CONTAINER_NAME% ^
                                --env-file .env ^
                                -p %PORT%:%PORT% ^
                                %IMAGE_NAME%:latest
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'USERS API desplegado correctamente'
        }
        failure {
            echo 'USERS API: Error en el pipeline'
        }
    }
}