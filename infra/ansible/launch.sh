#!/bin/sh

# shellcheck disable=SC2039
source env.sh

BASTION_NAME="instamint-bastion-host"
RESOURCE_GROUP="instamint"

echo "Creating SSH tunnels..."
az network bastion tunnel --name $BASTION_NAME --resource-group $RESOURCE_GROUP --target-resource-id /subscriptions/"$AZURE_SUBSCRIPTION_ID"/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Compute/virtualMachines/instamint-webapp-vm --resource-port 22 --port 52000 > /dev/null 2>&1 &
PID1=$!
az network bastion tunnel --name $BASTION_NAME --resource-group $RESOURCE_GROUP --target-resource-id /subscriptions/"$AZURE_SUBSCRIPTION_ID"/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Compute/virtualMachines/instamint-business-vm --resource-port 22 --port 52001 > /dev/null 2>&1 &
PID2=$!
az network bastion tunnel --name $BASTION_NAME --resource-group $RESOURCE_GROUP --target-resource-id /subscriptions/"$AZURE_SUBSCRIPTION_ID"/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Compute/virtualMachines/instamint-files-vm --resource-port 22 --port 52002 > /dev/null 2>&1 &
PID3=$!
az network bastion tunnel --name $BASTION_NAME --resource-group $RESOURCE_GROUP --target-resource-id /subscriptions/"$AZURE_SUBSCRIPTION_ID"/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Compute/virtualMachines/instamint-cron-vm --resource-port 22 --port 52003 > /dev/null 2>&1 &
PID4=$!

sleep 10

echo "Starting Ansible playbooks..."
ansible-playbook -i inventory/hosts.ini playbooks/launch.yml
ansible-playbook -i inventory/hosts.ini playbooks/vms/webapp.yml
ansible-playbook -i inventory/hosts.ini playbooks/vms/business.yml
ansible-playbook -i inventory/hosts.ini playbooks/vms/files.yml
ansible-playbook -i inventory/hosts.ini playbooks/vms/cron.yml

echo "Destroying SSH tunnels..."
kill $PID1 $PID2 $PID3 $PID4

echo "Ansible playbooks completed successfully."
