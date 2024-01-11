pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
          script {
           // The below will clone your repo and will be checked out to master branch by default.
           git credentialsId: '6a1ee97c-085b-4d61-82db-1a221c033910', url: 'https://github.com/KanaKBhuvaGit/playwright-cucumber', branch: 'main'
           // Do a ls -lart to view all the files are cloned. It will be clonned. This is just for you to be sure about it.
           // sh "ls -lart ./*" 
           // List all branches in your repo. 
           // sh "git branch -a"
           // Checkout to a specific branch in your repo.
           // sh(script: 'git checkout main')
           //   sh "git checkout main"
          }
      }
    }
    
    stage('Install Dependencies') {
      steps {
        bat 'npm ci'
        bat 'npx playwright install --with-deps'
      }
    }
    
    stage('Verif Playwright Version') {
      steps {
        bat 'npx playwright --version'
      }
    }

    stage('Run Tests') {
      steps {
          bat 'npm run test:ui'
      }
    }

    stage('Generate Allure report') {
      steps {
          bat 'npm run allure:generate'
      }
    }
  }

  post {
    // shutdown the server running in the background or appreciation
    always {
      echo 'Jordar .........'
      archiveArtifacts allowEmptyArchive: true, artifacts: 'test-results/**, allure-results/**, allure-report/**', followSymlinks: false, onlyIfSuccessful: true
    }
  }
}