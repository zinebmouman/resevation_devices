pipeline {
  agent any

  tools {
    jdk   'jdk17'
    maven 'maven'
  }

  environment {
    ORG          = 'zinebmouman'                    // organization SonarCloud
    PROJECT_KEY  = 'resevation_devices'             // juste le project key
    SONAR_TOKEN  = credentials('SONAR_TOKEN3')       // token SonarCloud (Secret Text)
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
          // Utilise sonar.token (recommandé) et NON sonar.login
          bat """
            mvn -B -e sonar:sonar ^
              -Dsonar.projectKey=%PROJECT_KEY% ^
              -Dsonar.organization=%ORG% ^
              -Dsonar.host.url=https://sonarcloud.io ^
              -Dsonar.token=%SONAR_TOKEN%
          """
        }
      }
    }
  }

  post {
    success { echo 'Pipeline OK → analyse envoyée à SonarCloud' }
    failure { echo 'Pipeline KO' }
  }
}
