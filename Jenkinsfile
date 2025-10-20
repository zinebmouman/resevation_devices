pipeline {
  agent any

  tools {
    jdk   'jdk17'
    maven 'maven'
  }

  environment {
    MAVEN_OPTS = '-Xmx1024m'
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/zinebmouman/resevation_devices.git'
      }
    }

    stage('Build & Unit Tests (backend)') {
      steps {
        dir('backend') {
          // Windows -> bat
          bat 'mvn -B -U clean verify'
        }
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
          archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
        }
      }
    }

    stage('SonarQube Analysis (backend)') {
      steps {
        dir('backend') {
          // Injecte SONAR_HOST_URL et SONAR_AUTH_TOKEN depuis la config "sonarqube"
          withSonarQubeEnv('sonarqube') {
            bat '''
              mvn -B -e sonar:sonar ^
                 -Dsonar.projectKey=reservation_devices ^
                 -Dsonar.projectName=ReservationApp ^
                 -Dsonar.host.url=%SONAR_HOST_URL% ^
                 -Dsonar.token=%SONAR_AUTH_TOKEN%
            '''
          }
        }
      }
    }

    // Optionnel: fonctionnera si le Webhook Sonar -> Jenkins est joignable
    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          script {
            def qg = waitForQualityGate()
            if (qg.status != 'OK') error "Quality Gate: ${qg.status}"
          }
        }
      }
    }

    // (Optionnel) Build front si présent
    stage('Build frontend (optionnel)') {
      when { expression { return fileExists('frontend/package.json') } }
      steps {
        dir('frontend') {
          bat '''
            call npm --version
            if errorlevel 1 exit /b 0
            call npm ci
            call npm run build
          '''
        }
      }
      post {
        success {
          archiveArtifacts artifacts: 'frontend/dist/**, frontend/build/**', fingerprint: true
        }
      }
    }
  }
}
