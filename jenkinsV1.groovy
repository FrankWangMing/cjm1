// 8051Jenkins
#!groovy

import org.jenkinsci.plugins.plaincredentials.StringCredentials

projectName = "ca-watershed-front-dev"
repoURL = "ssh://vcssh@phabricator.intern.yuansuan.cn/diffusion/62/cae.git"
repoPath = "/opt/jenkins/workspace/ca-watershed-front-dev"

Workdir = "/opt/jenkins/workspace/ca-watershed-front-dev/ca-watershed/frontend"

pipeline {
    agent {label 'gwnode'}

    stages {
        stage('clean') {
            steps {

                    sh"""
                        rm -rf ${repoPath}
                        mkdir -p ${repoPath}
                    """
            }
        }

        stage('clone') {
            steps {

                    sh"""
                        git clone --depth 1 ${repoURL} ${repoPath}
                    """
            }
        }
        stage('build') {
            steps {
                     echo 'build start.'

                     sh"""
                     cd ${Workdir}
                     docker login -u admin -p yskj2407 1.117.192.82:8666
                     docker build -t 1.117.192.82:8666/ca-watershed/ca-watershed-fe:latest .
                     docker push 1.117.192.82:8666/ca-watershed/ca-watershed-fe:latest
                     """
                     sh "ssh gwdev \"mkdir -p /opt/ca-watershed/front\""
                     echo 'build end.'
            }
        }
       stage('deploy') {
            steps {
                     echo 'deploy start.'
                     sh "scp -r ${Workdir}/nginx/fe.conf gwdev:/opt/ca-watershed/front/fe.conf"
                     sh "scp -r ${Workdir}/nginx/nginx.conf gwdev:/opt/ca-watershed/front/nginx.conf"
                     sh "ssh gwdev \"docker rm -f ca-watershed-fe || true\""
                     sh "ssh gwdev \"docker image prune -a -f || true\""
                     sh "ssh gwdev \"docker login -u admin -p yskj2407 1.117.192.82:8666\""
                     sh "ssh gwdev \"docker run -itd -p 8051:8051 -v /opt/ca-watershed/front/nginx.conf:/etc/nginx/nginx.conf -v /opt/ca-watershed/front/fe.conf:/etc/nginx/conf.d/default.conf  --restart=always --name ca-watershed-fe 1.117.192.82:8666/ca-watershed/ca-watershed-fe:latest\""
                     echo 'deploy end.'
            }
        }
       stage('report') {
            steps {
                echo 'Build && Test succeeded.'
                echo 'http://10.0.64.4:8051'
            }
        }
    }
}

// 8055Jenkins
#!groovy

import org.jenkinsci.plugins.plaincredentials.StringCredentials

projectName = "ca-watershed-front-dev"
repoURL = "ssh://vcssh@phabricator.intern.yuansuan.cn/diffusion/62/cae.git"
repoPath = "/opt/jenkins/workspace/ca-watershed-front-dev"

Workdir = "/opt/jenkins/workspace/ca-watershed-front-dev/ca-watershed/frontend"

pipeline {
    agent {label 'gwnode'}

    stages {
        stage('clean') {
            steps {

                    sh"""
                        rm -rf ${repoPath}
                        mkdir -p ${repoPath}
                    """
            }
        }

        stage('clone') {
            steps {

                    sh"""
                        git clone --depth 1 ${repoURL} ${repoPath}
                    """
            }
        }
        stage('build') {
            steps {
                     echo 'build start.'

                     sh"""
                     cd ${Workdir}
                     docker login -u admin -p yskj2407 1.117.192.82:8666
                     docker build -t 1.117.192.82:8666/ca-watershed/ca-watershed-fe-v2:latest .
                     docker push 1.117.192.82:8666/ca-watershed/ca-watershed-fe-v2:latest
                     """
                     sh "ssh gwdev \"mkdir -p /opt/ca-watershed/front\""
                     echo 'build end.'
            }
        }
       stage('deploy') {
            steps {
                     echo 'deploy start.'
                     sh "scp -r ${Workdir}/nginx/fe.conf gwdev:/opt/ca-watershed/front/fe.conf"
                     sh "scp -r ${Workdir}/nginx/nginx.conf gwdev:/opt/ca-watershed/front/nginx.conf"
                     sh "ssh gwdev \"docker rm -f ca-watershed-fe-v2 || true\""
                     sh "ssh gwdev \"docker image prune -a -f || true\""
                     sh "ssh gwdev \"docker login -u admin -p yskj2407 1.117.192.82:8666\""
                     sh "ssh gwdev \"docker run -itd -p 8055:8055 -v /opt/ca-watershed/front/nginx.conf:/etc/nginx/nginx.conf -v /opt/ca-watershed/front/fe.conf:/etc/nginx/conf.d/default.conf  --restart=always --name ca-watershed-fe-v2 1.117.192.82:8666/ca-watershed/ca-watershed-fe-v2:latest\""
                     echo 'deploy end.'
            }
        }
       stage('report') {
            steps {
                echo 'Build && Test succeeded.'
                echo 'http://10.0.64.4:8055'
            }
        }
    }
}


// 前端发布 -- 66环境 8051
#!groovy

import org.jenkinsci.plugins.plaincredentials.StringCredentials

projectName = "ca-watershed-front-dev"
repoURL = "ssh://vcssh@phabricator.intern.yuansuan.cn/diffusion/62/cae.git"
repoPath = "/opt/jenkins/workspace/ca-watershed-front-dev"

Workdir = "/opt/jenkins/workspace/ca-watershed-front-dev/ca-watershed/frontend"

pipeline {
    agent {label 'gwnode'}

    stages {
        stage('clean') {
            steps {

                    sh"""
                        rm -rf ${repoPath}
                        mkdir -p ${repoPath}
                    """
            }
        }

        stage('clone') {
            steps {

                    sh"""
                        git clone --depth 1 ${repoURL} ${repoPath}
                    """
            }
        }
        stage('build') {
            steps {
                     echo 'build start.'

                     sh"""
                     cd ${Workdir}
                     docker login -u admin -p yskj2407 1.117.192.82:8666
                     docker build -t 1.117.192.82:8666/ca-watershed/ca-watershed-fe:latest .
                     docker push 1.117.192.82:8666/ca-watershed/ca-watershed-fe:latest
                     """
                     sh "ssh gwmaster \"mkdir -p /opt/ca-watershed/front\""
                     echo 'build end.'
            }
        }
       stage('deploy') {
            steps {
                     echo 'deploy start.'
                     sh "scp -r ${Workdir}/nginx/fe.conf gwmaster:/opt/ca-watershed/front/fe.conf"
                     sh "scp -r ${Workdir}/nginx/nginx.conf gwmaster:/opt/ca-watershed/front/nginx.conf"
                     sh "ssh gwmaster \"docker rm -f ca-watershed-fe || true\""
                     sh "ssh gwmaster \"docker image prune -a -f || true\""
                     sh "ssh gwmaster \"docker login -u admin -p yskj2407 1.117.192.82:8666\""
                     sh "ssh gwmaster \"docker run -itd -p 8051:8051 -v /opt/ca-watershed/front/nginx.conf:/etc/nginx/nginx.conf -v /opt/ca-watershed/front/fe.conf:/etc/nginx/conf.d/default.conf  --restart=always --name ca-watershed-fe 1.117.192.82:8666/ca-watershed/ca-watershed-fe:latest\""
                     echo 'deploy end.'
            }
        }
       stage('report') {
            steps {
                echo 'Build && Test succeeded.'
                echo 'http://10.0.64.4:8051'
            }
        }
    }
}