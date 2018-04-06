pipeline {
  agent {
    node {
      label 'master'
    }
  }
  stages {
    stage('build') {
      when { anyOf { branch 'release'; branch 'staging' } }
      steps {
        script {
          if (env.BRANCH_NAME == 'staging') {
            env.JOVEO_ENV = "staging"
            env.AWS_INSTANCE_TAG = "pubmato-ui"
          }
          if (env.BRANCH_NAME == 'release') {
            env.JOVEO_ENV = "prod"
            env.AWS_INSTANCE_TAG = "pubmato-release"
          }
        }
        sh 'sh build.sh $JOVEO_ENV'
      }
    }
    stage('push to ecr') {
      when { anyOf { branch 'release'; branch 'staging' } }
      steps {
        sh 'docker tag joveo/pubmato 485239875118.dkr.ecr.us-east-1.amazonaws.com/pubmato:$JOVEO_ENV'
        sh '$(aws ecr get-login --region us-east-1 | sed -e \'s/-e none//g\')'
        sh 'docker push 485239875118.dkr.ecr.us-east-1.amazonaws.com/pubmato:$JOVEO_ENV'
      }
    }
    stage('deploy to ec2') {
      when { anyOf { branch 'release'; branch 'staging' } }
      steps {
        sh 'sh -vx deploy.sh $AWS_INSTANCE_TAG 485239875118.dkr.ecr.us-east-1.amazonaws.com/pubmato $JOVEO_ENV'
      }
    }
  }
}
