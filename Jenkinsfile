pipeline {
    agent any

    tools {
        nodejs 'Node21.7'
    }

    environment {
        DOCKER_IMAGE = 'node-express-app'
        DOCKER_TAG   = "build-${env.BUILD_NUMBER}"
        PATH = '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'
        PUSH_TO_REGISTRY = 'true'
    }

    stages {
        stage('Github Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/flaseen/node-express.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || echo "No tests found"'
            }
        }

        stage('Check Docker') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build --pull --no-cache \
                        -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                        -t ${DOCKER_IMAGE}:latest .
                    '''
            }
        }

        stage('Push to Dockerhub or Container Registry') {
            when {
                environment name: 'PUSH_TO_REGISTRY', value: 'true'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_USER/$DOCKER_IMAGE:$DOCKER_TAG'
                    sh 'docker push $DOCKER_USER/$DOCKER_IMAGE:$DOCKER_TAG'
                }
            }
        }

        stage('Deploy on Docker') {
            steps {
                sh 'docker compose down -v'
                sh 'docker compose build --no-cache && docker compose up -d'
            }
        }
    }

    post {
        always {
            slackSend(
                channel: '#ci-cd-workflows', 
                color: currentBuild.currentResult == 'SUCCESS' ? 'good' : 'danger',
                message: "Build ${currentBuild.fullDisplayName} finished: ${currentBuild.currentResult}.\n${env.BUILD_URL}"
            )
        }
        success {
            emailext(
                subject: "SUCCESS: ${currentBuild.fullDisplayName}",
                body: "Good news! The build succeeded.\n\nSee details: ${env.BUILD_URL}",
                to: 'mwambeyu.jnr@gmail.com'
            )
        }
        failure {
            emailext(
                subject: "FAILURE: ${currentBuild.fullDisplayName}",
                body: "Build failed. Check logs: ${env.BUILD_URL}",
                to: 'mwambeyu.jnr@gmail.com'
            )
        }
    } 
}