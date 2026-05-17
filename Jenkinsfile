pipeline {
    agent any

    environment {
        IMAGE_NAME = 'users-api'
        COMPOSE_DIR = 'C:\\Users\\LENOVO\\Desktop\\electiva 3'
    }

    stages {
        stage('Instalar Dependencias') {
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

        stage('Construir Imagen Docker') {
            steps {
                echo 'Construyendo imagen users-api...'
                script {
                    if (isUnix()) {
                        sh "docker build -t ${IMAGE_NAME}:latest ."
                    } else {
                        bat "docker build -t %IMAGE_NAME%:latest ."
                    }
                }
            }
        }

        // ← faltaba el stage de despliegue completo
        stage('Desplegar Contenedores') {
            steps {
                echo 'Desplegando users-api-1 y users-api-2...'
                script {
                    if (isUnix()) {
                        sh """
                            cd "${COMPOSE_DIR}"
                            docker compose --env-file ./users/.env up -d --no-deps --force-recreate \
                                users-api-1 users-api-2
                        """
                    } else {
                        bat """
                            cd "%COMPOSE_DIR%"
                            docker compose --env-file ./users/.env up -d --no-deps --force-recreate users-api-1 users-api-2
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'users-api desplegado correctamente en ambas instancias'
        }
        failure {
            echo 'Error al desplegar users-api'
        }
    }
}