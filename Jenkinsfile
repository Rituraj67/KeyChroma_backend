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
                withCredentials([usernamePassword(credentialsId:'DockerHubCred', passwordVariable:'DH_PASS', usernameVariable:'DH_USER')]){
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

        // stage('Setup and Configure Nginx'){
        //     steps{
        //         script {
        //             echo 'Updating package list...'
        //             sh 'sudo apt update'
        //            def nginxInstalled = sh(script: "which nginx", returnStatus: true)
        //             if (nginxInstalled != 0) {
        //                 // Install Nginx if it's not installed
        //                 echo 'Installing Nginx...'
        //                 sh 'sudo apt install -y nginx'
        //             } else {
        //                 echo "Nginx is already installed, skipping installation."
        //             }
        //             echo 'Starting Nginx service...'
        //             sh 'sudo systemctl start nginx'

        //             // Step 4: Enable Nginx to start on boot
        //             echo 'Enabling Nginx to start on boot...'
        //             sh 'sudo systemctl enable nginx'

        //             // Step 5: Configure Nginx (for example, copying a custom config)
        //             echo 'Configuring Nginx...'
        //             sh '''
        //                 echo "server {
        //                     server_name apikeychroma.riturajs.me;

        //                     # Proxy requests to the backend server
        //                     location / {
        //                         proxy_pass http://localhost:80/;
        //                         proxy_set_header Host $host;
        //                         proxy_set_header X-Real-IP $remote_addr;
        //                         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        //                     }

        //                     # Optional: Static files (if needed for the app)
        //                     location /static/ {
        //                         alias /var/www/apikeychroma.riturajs.me/static/;
        //                     }

        //                     listen 443 ssl; # managed by Certbot
        //                     ssl_certificate /etc/letsencrypt/live/keychroma.riturajs.me/fullchain.pem; # managed by Certbot
        //                     ssl_certificate_key /etc/letsencrypt/live/keychroma.riturajs.me/privkey.pem; # managed by Certbot
        //                     include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        //                     ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
        //                 }

        //                 server {
        //                     if ($host = apikeychroma.riturajs.me) {
        //                         return 301 https://$host$request_uri;
        //                     } # managed by Certbot

        //                     listen 80;
        //                     server_name apikeychroma.riturajs.me;
        //                     return 404; # managed by Certbot
        //                 }" | sudo tee /etc/nginx/sites-available/default
        //             '''

        //             echo "setting ssl certificate.."
        //             sh "sudo certbot --nginx -d apikeychroma.riturajs.me"

        //             // Step 6: Reload Nginx to apply changes
        //             echo 'Reloading Nginx to apply changes...'
        //             sh 'sudo systemctl reload nginx'

        //             // Step 7: Check Nginx status
        //             echo 'Checking Nginx status...'
        //             sh 'sudo systemctl status nginx'
        //         }
        //     }
        // }
    }
}
