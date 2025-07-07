pipeline {
    agent any

    environment {
        // Replace with your GitHub username if different
        GITHUB_USERNAME = 'upushpak'
        // Replace with your repository name
        REPO_NAME = 'HobbyProject'
        // Base href for GitHub Pages deployment
        BASE_HREF = "/${env.REPO_NAME}/"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', credentialsId: 'github-credentials', url: "https://github.com/${env.GITHUB_USERNAME}/${env.REPO_NAME}.git"
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'ng build --configuration production'
            }
        }

        // Optional: Add a testing stage here if you have unit/e2e tests
        // stage('Test') {
        //     steps {
        //         sh 'ng test --no-watch --browsers=ChromeHeadless'
        //         // sh 'ng e2e' // Uncomment if you have e2e tests configured
        //     }
        // }

        stage('Deploy to GitHub Pages') {
            steps {
                // Ensure you have configured a GitHub Personal Access Token in Jenkins
                // with 'repo' scope and added it as a 'Secret text' credential,
                // then replace 'github-deploy-token' with your credential ID.
                withCredentials([string(credentialsId: 'github-deploy-token', variable: 'GH_TOKEN')]) {
                    sh "npx angular-cli-ghpages --dir dist/${env.REPO_NAME} --repo https://github.com/${env.GITHUB_USERNAME}/${env.REPO_NAME}.git --name "Jenkins CI" --email "jenkins@example.com" --no-silent --base-href ${env.BASE_HREF} --token ${GH_TOKEN}"
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}