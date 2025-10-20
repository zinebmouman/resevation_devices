pipeline {
  agent any

  tools {
    jdk   'jdk17'
    maven 'maven'
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
          junit 'backend/target/surefire-reports/*.xml'
          archiveArtifacts artifacts: 'backend/target/.jar, backend/target/.war', fingerprint: true
        }
      }
    }

    stage('SonarQube Analysis (backend)') {
    steps {
      dir('backend') {
        withSonarQubeEnv('sonarqube') {
          bat """
            mvn -B -e sonar:sonar ^
              -Dsonar.projectKey=reservation ^
              -Dsonar.projectName=ReservationApp ^
              -Dsonar.host.url=%SONAR_HOST_URL% ^
              -Dsonar.token=%SONAR_AUTH_TOKEN%
          """
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
        success { archiveArtifacts artifacts: 'frontend/dist/, frontend/build/', fingerprint: true }
      }
    }

    stage('Check Sonar Connectivity') {
      steps {
        withSonarQubeEnv('sonarqube') {
          bat 'echo SONAR_HOST_URL=%SONAR_HOST_URL%'
          // Vérifie le status du serveur
          bat 'powershell -command "try { (Invoke-WebRequest %SONAR_HOST_URL%/api/system/status -UseBasicParsing).Content } catch { Write-Host $_; exit 1 }"'
        }
      }
    }


    stage('Docker Build & Push (optionnel)') {
      when { expression { return fileExists('docker-compose.yml') } }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          bat """
            echo %DH_PASS% | docker login -u %DH_USER% --password-stdin
            docker build -t %DH_USER%/reservation_backend:latest backend
            docker push %DH_USER%/reservation_backend:latest
          """
        }
      }
    }
  }
}
