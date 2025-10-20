pipeline {
  agent any

  tools {
    maven 'maven'   // nom configuré dans Manage Jenkins > Global Tool Configuration
    jdk 'jdk17'
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
          bat 'mvn -B -e clean package -DskipTests'
        }
      }
    }

    stage('Tests') {
      steps {
        dir('backend') {
          bat 'mvn -B -e test'
        }
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        dir('backend') {
          withSonarQubeEnv('sonarqube') {
            // %SONAR_HOST_URL% et %SONAR_AUTH_TOKEN% sont fournis par withSonarQubeEnv
            bat '''
              mvn -B -e sonar:sonar ^
                -Dsonar.projectKey=reservation ^
                -Dsonar.projectName=ReservationApp ^
                -Dsonar.host.url=%SONAR_HOST_URL% ^
                -Dsonar.token=%SONAR_AUTH_TOKEN%
            '''
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 2, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Docker Build & Push') {
      steps {
        // Si Docker Desktop est installé : "docker compose" fonctionne.
        // Sinon, remplace par "docker-compose".
        bat 'docker compose build'

        withCredentials([usernamePassword(
          credentialsId: 'dockerhub',       // crée ce credentials (Username + Password/PAT)
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
        }

        // Adapte le nom de l'image construite par compose si besoin (vérifie avec: docker images)
        bat '''
          docker tag gestion_reservation-main-backend:latest zinebmouman/reservation_backend:latest
          docker push zinebmouman/reservation_backend:latest
        '''
      }
    }
  }
}
