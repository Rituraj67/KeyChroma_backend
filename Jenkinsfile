pipeline {
    agent { label 'Rituraj' }

    stages {
        stage('Code') {
            steps {
                echo 'Cloning The Code'
                git url: 'https://github.com/Rituraj67/KeyChroma_backend.git', branch:'master'
                echo 'Cloning successful'
            }
        }

        stage('build') {
            steps {
                echo 'Building the Code'
                withCredentials([usernamePassword(credentialsId:'DockerHubCred', passwordVariable:'DH_PASS', usernameVariable:'DH_USER')]) {
                    sh "docker build --rm -t ${env.DH_USER}/keychromabackend ."
                }
                echo 'build successful'
            }
        }

        stage('push dockehub') {
            steps {
                echo 'Pushing image to dockerhub'
                withCredentials([usernamePassword(credentialsId:'DockerHubCred', passwordVariable:'DH_PASS', usernameVariable:'DH_USER')]) {
                    sh "docker login -u ${env.DH_USER} -p ${env.DH_PASS}"
                    sh "docker push ${env.DH_USER}/keychromabackend"
                }
            }
        }

        stage('deploy') {
            steps {
                echo 'Deploying...'
                sh """
                docker compose down
                docker rmi ${env.DH_USER}/keychromabackend:latest || true
                docker compose pull
                docker compose up -d
                """
                echo 'Successfully Deployed'
            }
        }
    }
}
