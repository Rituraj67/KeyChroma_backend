@Library("SharedLib") _

pipeline {
    agent { label 'Rituraj' }

    stages {
        stage('Code_Clone') {
            steps {
                script{
                    //arg(git_url, git_branch)
                    Git_Clone('https://github.com/Rituraj67/KeyChroma_backend.git', 'master')
                }
            }
        }

        stage('Build_Docker_Image') {
            steps {
                script{
                    withCredentials([usernamePassword(credentialsId:'DockerHubCred', passwordVariable:'DH_PASS', usernameVariable:'DH_USER')]) {
                        //arg(dockerhub username, hub repo name)
                        Build_Docker_Image("${env.DH_USER}", "keychromabackend" )
                    }
                }
            }
        }

        stage('DockerHub_Push') {
            steps {
                script{
                    withCredentials([usernamePassword(credentialsId:'DockerHubCred', passwordVariable:'DH_PASS', usernameVariable:'DH_USER')]) {
                        //arg(dockerhub username, dockerhub pass, image repo name)
                        DockerHub_Push("${env.DH_USER}", "${env.DH_PASS}", "keychromabackend")
                    }
                }

            }
        }

        stage('Docker_Compose') {
            steps {
                script{
                    withCredentials([usernamePassword(credentialsId:'DockerHubCred', passwordVariable:'DH_PASS', usernameVariable:'DH_USER')]){
                        //arg(dockerhub username, image repo name)
                        Docker_Compose("${env.DH_USER}", "keychromabackend")
                    }
                }
            }
        }

    }
}
