pipeline {
    agent any

    environment {
        IMAGE_NAME        = 'users-api'
        COMPOSE_SERVICES  = 'users-api-1 users-api-2'
        REMOTE_DEPLOY_DIR = '/opt/devmart'
        COMPOSE_FILE      = 'docker-compose.prod.yml'
        DEVMART_EC2_HOST  = credentials('DEVMART_EC2_HOST')
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                bat 'npm ci || npm install'
            }
        }

        stage('Construir imagen Docker') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:latest .'
            }
        }

        stage('Desplegar en EC2') {
            steps {
                sshagent(credentials: ['DEVMART_EC2_SSH']) {
                    bat '''
                        docker save %IMAGE_NAME%:latest -o image.tar
                        scp -o StrictHostKeyChecking=no image.tar ubuntu@%DEVMART_EC2_HOST%:/tmp/%IMAGE_NAME%.tar
                        ssh -o StrictHostKeyChecking=no ubuntu@%DEVMART_EC2_HOST% "docker load -i /tmp/%IMAGE_NAME%.tar && rm -f /tmp/%IMAGE_NAME%.tar"
                        ssh -o StrictHostKeyChecking=no ubuntu@%DEVMART_EC2_HOST% "cd %REMOTE_DEPLOY_DIR% && docker compose -f %COMPOSE_FILE% up -d --no-deps %COMPOSE_SERVICES%"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'users-api desplegado en EC2.'
        }
        failure {
            echo 'Error en pipeline users-api.'
        }
    }
}
