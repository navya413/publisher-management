pipeline {
  agent {
    node {
      label 'master'
    }
  }
  stages {
      stage('set env vars') {
        when { anyOf { branch 'release'; branch 'staging' } }
        steps {
          script {
            env.REG_URL = "997116068644.dkr.ecr.us-east-1.amazonaws.com"
            env.REPO = "pubmato"
            if (env.BRANCH_NAME == 'release') {
              env.REG_URL = "485239875118.dkr.ecr.us-east-1.amazonaws.com"
              env.JOVEO_ENV = "prod"
              env.AWS_INSTANCE_TAG = "pubmato-ui-release"
            }
            if (env.BRANCH_NAME == 'staging') {
              env.JOVEO_ENV = "staging"
              env.AWS_INSTANCE_TAG = "pubmato-ui-staging"
            }
          }
        }
      }
    stage('build') {
      when { anyOf { branch 'release'; branch 'staging' } }
      steps {
        sh 'sh build.sh $JOVEO_ENV'
      }
    }
    stage('push to ecr') {
      when { anyOf { branch 'release'; branch 'staging' } }
      steps {
        sh 'docker tag joveo/$REPO $REG_URL/$REPO:$JOVEO_ENV'
        script {
          if (env.BRANCH_NAME == 'release') {
              sh '$(aws ecr get-login --region us-east-1 --no-include-email)'
          } else {
              sh '$(aws ecr get-login --region us-east-1 --no-include-email --profile joveo-dev)'
          }
        }
        sh 'docker push $REG_URL/$REPO:$JOVEO_ENV'
      }
    }
    stage('deploy to ec2') {
      when { anyOf { branch 'release'; branch 'staging' } }
      steps {
        sh 'sh -vx deploy.sh $AWS_INSTANCE_TAG $REG_URL/$REPO $JOVEO_ENV'
      }
    }
  }
}
