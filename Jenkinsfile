pipeline {
    agent any

    tools {
        maven 'Maven'
        jdk 'jdk17'
    }

    environment {
        SONARQUBE = credentials('sonar')  // configuré dans Jenkins Credentials
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/zinebmouman/resevation_devices.git'
            }
        }

        stage('Build') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Tests') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
        }

        stage('SonarQube Analysis') {
          steps {
            dir('backend') {
              withSonarQubeEnv('sonarqube') {
                sh '''
                  mvn -B -e sonar:sonar \
                    -Dsonar.projectKey=reservation \
                    -Dsonar.projectName=ReservationApp \
                    -Dsonar.host.url=$SONAR_HOST_URL
                '''
              }
            }
          }
        }

        stage('Docker Build & Push') {
            steps {
                sh 'docker-compose build'
                sh 'docker login -u zinebmouman -p $DOCKER_TOKEN'
                sh 'docker tag gestion_reservation-main-backend zinebmouman/reservation_backend:latest'
                sh 'docker push zinebmouman/reservation_backend:latest'
            }
        }
    }
}
