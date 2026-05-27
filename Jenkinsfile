pipeline {

    agent any

    environment {
        IMAGE_NAME   = 'jsolano0112/users-api'
        ECS_CLUSTER  = 'devmart-cluster'
        SERVICE_NAME = 'users-api'
        AWS_REGION   = 'us-east-1'
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

        stage('Deploy QA') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'AWS_ACCESS_KEY_ID',     variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY'),
                    ]) {
                        echo "Iniciando despliegue directo en AWS ECS Fargate (QA)"
                        
                        bat """
                            aws ecs update-service ^
                            --cluster %ECS_CLUSTER% ^
                            --service %SERVICE_NAME% ^
                            --force-new-deployment ^
                            --region %AWS_REGION% > nul
                        """
                        
                        echo "Despliegue enviado con éxito a ECS."
                    }
                }
            }
        }
    }

     post {
        success { 
            echo '======================================================='
            echo " users-api actualizado exitosamente" 
            echo '======================================================='
        }
        failure { 
            echo 'Fallo el pipeline de construcción/despliegue de users-api' 
        }
    }
}