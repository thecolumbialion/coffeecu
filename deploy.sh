#!/bin/bash

SSH_TO="root@159.203.139.9"

if ssh $SSH_TO "cp /opt/coffeecu/current/bundle/upload/* /opt/coffeecu-photos"
then
    mup deploy
    ssh $SSH_TO "cp /opt/coffeecu/current/bundle/upload/* /opt/coffeecu-photos"
fi