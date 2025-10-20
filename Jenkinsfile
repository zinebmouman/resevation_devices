pipeline {
  agent any

  tools {
    jdk   'jdk17'     // Nom du JDK dans Manage Jenkins > Tools
    maven 'maven'     // Nom de Maven dans Manage Jenkins > Tools
  }

  // ==== RENSEIGNE ICI TON ORG/PROJET SONARCLOUD ====
  environment {
    ORG          = 'zinebmouman'            // ex: ibt2
    PROJECT_KEY  = 'zinebmouman_resevation_devices'    // ex: reservation_devices
    SONAR_TOKEN  = credentials('SONAR_TOKEN3') // Secret Text avec le token SonarCloud
    MAVEN_OPTS   = '-Xmx1024m'
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

    stage('SonarCloud Analysis (backend)') {
      steps {
        dir('backend') {
          bat """
            mvn -B -e sonar:sonar ^
              -Dsonar.projectKey=%ORG%_%PROJECT_KEY% ^
              -Dsonar.organization=%ORG% ^
              -Dsonar.host.url=https://sonarcloud.io ^
              -Dsonar.login=%SONAR_TOKEN%
          """
        }
      }
    }

    // (Facultatif) Archiver le front si présent
    stage('Build frontend (optionnel)') {
      when { expression { return fileExists('frontend/package.json') } }
      steps {
        dir('frontend') {
          bat '''
            call npm ci
            call npm run build
          '''
        }
      }
      post {
        success { archiveArtifacts artifacts: 'frontend/dist/**, frontend/build/**', fingerprint: true }
      }
    }
  }

  post {
    success { echo 'Pipeline OK (analyse envoyée à SonarCloud)' }
    failure { echo 'Pipeline KO' }
  }
}
