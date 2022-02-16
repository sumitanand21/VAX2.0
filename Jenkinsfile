pipeline {
  agent {
    label "jenkins-nodejs"
  }
  environment {
    ORG = 'ml'
    APP_NAME = 'ml-angular-userinterface'
    CHARTMUSEUM_CREDS = credentials('jenkins-x-chartmuseum')
    DOCKER_REGISTRY_ORG = 'ml'
  }
  stages {
    stage('CI Build and push snapshot') {
      when {
        branch 'PR-*'
      }
      environment {
        PREVIEW_VERSION = "0.0.0-SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
        PREVIEW_NAMESPACE = "$APP_NAME-$BRANCH_NAME".toLowerCase()
        HELM_RELEASE = "$PREVIEW_NAMESPACE".toLowerCase()
      }
      steps {
        container('nodejs') {
          sh "jx step credential -s npm-token -k file -f /builder/home/.npmrc --optional=true"
          dir("Metis_UI") {
              sh "pwd"
              sh "npm install -g @angular/cli@8.2.2"
              sh "npm install"
              sh "npm run buildDeploy"
              sh "sh angular_build.sh"
          }
          
          sh "export VERSION=$PREVIEW_VERSION && skaffold build -f skaffold.yaml"
          // sh "jx step post build --image $DOCKER_REGISTRY/$ORG/$APP_NAME:$PREVIEW_VERSION"
          sh "jx step post build --image $DOCKER_REGISTRY/$ORG/backend:\$(cat VERSION)"
          sh "jx step post build --image $DOCKER_REGISTRY/$ORG/frontend:\$(cat VERSION)"

          dir('./charts/preview') {
            sh "make preview"
            sh "jx preview --app $APP_NAME --dir ../.."
          }
        }
      }
    }
    stage('Build Release') {
      when {
        branch 'master'
      }
      steps {
        container('nodejs') {

          // ensure we're not on a detached head
          sh "git checkout master"
          sh "git config --global credential.helper store"
          sh "jx step git credentials"

          // so we can retrieve the version in later steps
          sh "echo \$(jx-release-version) > VERSION"
          sh "jx step tag --version \$(cat VERSION)"
          sh "jx step credential -s npm-token -k file -f /builder/home/.npmrc --optional=true"
          dir("Metis_UI") {
              sh "pwd"
              sh "npm install -g @angular/cli@8.2.2"
              sh "npm install"
              sh "npm run buildDeploy"
              sh "sh angular_build.sh"
          }
          
          sh "export VERSION=`cat VERSION` && skaffold build -f skaffold.yaml"
          // sh "jx step post build --image $DOCKER_REGISTRY/$ORG/$APP_NAME:$PREVIEW_VERSION"
          sh "jx step post build --image $DOCKER_REGISTRY/$ORG/backend:\$(cat VERSION)"
          sh "jx step post build --image $DOCKER_REGISTRY/$ORG/frontend:\$(cat VERSION)"
        }
      }
    }
    stage('Promote to Environments') {
      when {
        branch 'master'
      }
      steps {
        container('nodejs') {
          dir('./charts/ml-angular-userinterface') {
            sh "jx step changelog --batch-mode --version v\$(cat ../../VERSION)"

            sh "helm init --client-only --stable-repo-url https://charts.helm.sh/stable"
            // release the helm chart
            sh "jx step helm release"

            // promote through all 'Auto' promotion Environments
            sh "jx promote -b --all-auto --timeout 1h --version \$(cat ../../VERSION)"
          }
        }
      }
    }
  }
  post {
        always {
          cleanWs()
        }
  }
}
