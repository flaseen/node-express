pipeline {
    agent any

    tools {
        nodejs 'Node21.7'
    }

    environment {
        DOCKER_USER      = credentials('dockerhub-user')
        DOCKER_IMAGE     = 'node-express-app'
        DOCKER_TAG       = "v${env.BUILD_NUMBER}"
        PATH             = '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'
        PUSH_TO_REGISTRY = 'true'
        APP_ENV          = 'dev'
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
                script {
                    if (env.APP_ENV == 'dev') {
                        sh '''
                            docker compose -f docker-compose.dev.yml build
                        '''
                    } else {
                        sh '''
                            docker build --pull --no-cache \
                                -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                                -t ${DOCKER_IMAGE}:latest .
                        '''
                    }
                }
            }
        }

        stage('Push to Dockerhub or Container Registry Of Choice') {
            // Only push if in prod and PUSH_TO_REGISTRY is true
            when {
                allOf {
                    environment name: 'PUSH_TO_REGISTRY', value: 'true'
                    expression { env.APP_ENV == 'prod' }
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                        # Push versioned tag
                        docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_USER/$DOCKER_IMAGE:$DOCKER_TAG
                        docker push $DOCKER_USER/$DOCKER_IMAGE:$DOCKER_TAG

                        # Push latest tag
                        docker tag $DOCKER_IMAGE:latest $DOCKER_USER/$DOCKER_IMAGE:latest
                        docker push $DOCKER_USER/$DOCKER_IMAGE:latest
                    '''
                }
            }
        }

        stage('Prepare Env File') {
            steps {
                sh 'cp .env.example .env'
            }
        }

        stage('Deploy on Docker') {
            steps {
                script {
                    // Fail if .env is missing
                    sh '''
                        if [ ! -f .env ]; then
                        echo ".env file is missing! Did you run the Prepare Env File stage?"
                        exit 1
                        fi
                    '''

                    if (env.APP_ENV == 'dev') {
                        // Dev: rebuild & run with docker-compose.dev.yml
                        sh '''
                            docker compose -f docker-compose.dev.yml down
                            docker compose -f docker-compose.dev.yml up -d --build
                        '''
                    } else {
                        // Prod: pull pushed image & run with docker-compose.prod.yml
                        sh """
                            echo "Deploying image: ${DOCKER_USER}/${DOCKER_IMAGE}:${DOCKER_TAG}"

                            DOCKER_USER=${DOCKER_USER} \
                            DOCKER_IMAGE=${DOCKER_IMAGE} \
                            DOCKER_TAG=${DOCKER_TAG} \
                            docker compose -f docker-compose.prod.yml down

                            DOCKER_USER=${DOCKER_USER} \
                            DOCKER_IMAGE=${DOCKER_IMAGE} \
                            DOCKER_TAG=${DOCKER_TAG} \
                            docker compose -f docker-compose.prod.yml pull

                            DOCKER_USER=${DOCKER_USER} \
                            DOCKER_IMAGE=${DOCKER_IMAGE} \
                            DOCKER_TAG=${DOCKER_TAG} \
                            docker compose -f docker-compose.prod.yml up -d
                        """
                    }
                }
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