FROM node:8
RUN apt-get update && apt-get install -y locales sudo
RUN adduser ubuntu
RUN usermod -aG sudo ubuntu
RUN echo 'ubuntu ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
USER ubuntu
RUN sudo locale-gen en_US.UTF-8 && sudo localedef -i en_US -f UTF-8 en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
RUN curl https://install.meteor.com/ | sh
ADD . /home/ubuntu/app
RUN sudo chown -R ubuntu:ubuntu /home/ubuntu/app
WORKDIR /home/ubuntu/app
EXPOSE 3000
CMD ["/bin/bash", "-c", "./run.sh"]
