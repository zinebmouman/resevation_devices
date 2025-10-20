pipeline {
  agent any

  tools {
    jdk   'jdk17'
    maven 'maven3'   // <-- mets ici le nom EXACT dans Manage Jenkins > Tools
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
          archiveArtifacts artifacts: 'backend/target/*.jar, backend/target/*.war', fingerprint: true
        }
      }
    }

    stage('SonarQube Analysis (backend)') {
      steps {
        dir('backend') {
          // Injecte SONAR_HOST_URL + SONAR_AUTH_TOKEN depuis la config "sonarqube"
          withSonarQubeEnv('sonarqube') {
            bat '''
              mvn -B sonar:sonar ^
                -Dsonar.projectKey=resevation_backend ^
                -Dsonar.projectName=ReservationApp ^
                -Dsonar.sources=src/main/java ^
                -Dsonar.java.binaries=target
            '''
          }
        }
      }
    }

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
  }
}
