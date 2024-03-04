# 🔑 Security Overview

The security of the system is a **_top priority for the development team_**. The system is designed to be secure by
default, and the development team has _**taken a number of steps**_ to ensure that the _**system is secure**_.

## 🔒 SonarQube

We use SonarQube to analyze the code and identify security vulnerabilities during our CI (Continuous Integration) runs.

### 💻 Setup

- To set up SonarQube, follow the steps below:<br><br>

  - Get a VPS with a minimum of **_3GB of ram_** and **_Ubuntu as the OS_** , from the provider you want. In our case
    it's \* \*_Digital Ocean_\*\*.
  - 📥 Install PostgreSQL on the VPS:

  ```bash
  sudo apt update
  sudo apt upgrade

  sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'   # Add the PostgreSQL repository
  wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo tee /etc/apt/trusted.gpg.d/pgdg.asc &>/dev/null    # Import the repository signing key

  sudo apt update
  sudo apt-get -y install postgresql postgresql-contrib    # Install the postgresql package
  sudo systemctl enable postgresql     # Enable the postgresql service
  ```

  - 🚀 Create Database and User:

  ```bash
  sudo passwd postgres  # Set a password for the postgres user
  su - postgres  # Switch to the postgres user

  createuser sonar   # Create a user

  psql   # Start the psql shell

  ALTER USER sonar WITH ENCRYPTED password 'ur_password';    # Set a password for the user
  CREATE DATABASE sonarqube OWNER sonar;      # Create a database and set the owner to the sonar user
  grant all privileges on DATABASE sonarqube to sonar;      # Grant all privileges to the sonar user
  \q   # Quit the psql shell

  exit # Exit the postgres user
  ```

  - 🌪️ Install JAVA 17:

  ```bash
  sudo bash   # Switch to the root user
  sudo apt update

  sudo apt install openjdk-17-jdk -y  # Install the openjdk-17-jdk package
  update-alternatives --config java  # Set the default java version
  /usr/bin/java --version   # Check the java version

  exit  # Exit the root user
  ```

  - 🐌 Update the system limits: `You can use nano or any other text editor`

  ```bash
  sudo vim /etc/security/limits.conf  # Edit the limits.conf file

  ## Pass the following lines at the bottom of the file:
  sonarqube   -   nofile   65536
  sonarqube   -   nproc    4096
  ```

  ```bash
  sudo vim /etc/sysctl.conf  # Edit the sysctl.conf file

  ## Pass the following line at the bottom of the file:
  vm.max_map_count = 262144
  ```

  ```bash
  sudo reboot # Reboot the system to apply the changes
  ```

  - 🔍 Install SonarQube:

  ```bash
  sudo wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-9.9.0.65466.zip    # Download the sonarqube package, you can check the latest version on the sonarqube website
  sudo apt install unzip  # Install the unzip package
  sudo unzip sonarqube-9.9.0.65466.zip -d /opt    # Unzip the sonarqube package
  sudo mv /opt/sonarqube-9.9.0.65466 /opt/sonarqube     # Rename the sonarqube directory

  sudo groupadd sonar   # Create a group
  sudo useradd -c "user to run SonarQube" -d /opt/sonarqube -g sonar sonar    # Create a user
  sudo chown sonar:sonar /opt/sonarqube -R   # Change the owner of the sonarqube directory
  ```

  - ✒️ Update the sonarqube configuration file:

  ```bash
  sudo vim /opt/sonarqube/conf/sonar.properties  # Edit the sonar.properties file

  ## Uncomment the following lines and update them:
  sonar.jdbc.username=sonar
  sonar.jdbc.password=ur_password
  sonar.jdbc.url=jdbc:postgresql://localhost:5432/sonarqube
  ```

  - 🌀 Install SonarQube as a service:

  ```bash
  sudo vim /etc/systemd/system/sonar.service  # Create a sonar service file

  ## Pass the following lines in the file:
  [Unit]
  Description=SonarQube service
  After=syslog.target network.target

  [Service]
  Type=forking

  ExecStart=/opt/sonarqube/bin/linux-x86-64/sonar.sh start
  ExecStop=/opt/sonarqube/bin/linux-x86-64/sonar.sh stop

  User=sonar
  Group=sonar
  Restart=always

  LimitNOFILE=65536
  LimitNPROC=4096

  [Install]
  WantedBy=multi-user.target
  ```

  - 🟢 Start SonarQube:

  ```bash
  sudo systemctl start sonar   # Start the sonar service
  sudo systemctl enable sonar  # Enable the sonar service
  sudo systemctl status sonar  # Check the status of the sonar service
  ```

  - 🌐 SonarQube access in web browser:

  ```bash
  http://<your_domain_or_IP>:9000
  ```

  - ⭐️ Utils:

  ```bash
  sudo apt install net-tools # Install the net-tools package
  netstat -tulnp | grep LISTEN  # Check the ports that are listening

  ip addr show  # Check the IP address of the system

  sudo tail -f /opt/sonarqube/logs/sonar.log # Check the sonarqube logs
  ```

### 🧪 Integration with GitHub Actions

⚠️ To integrate SonarQube with GitHub Actions, follow the steps below:

- On your SonarQube server, create a blank project to have the `projectKey` and generate
  a **_token for integrating GitHub actions_**.

- Setup of 2 secrets in the GitHub repository settings:

  - `SONAR_TOKEN`: The token generated from the SonarQube server.
  - `SONAR_HOST_URL`: The URL of the SonarQube server.

- Create a file named `sonar-project.properties` in the root of the project with the following content:

  ```properties
  sonar.projectKey=           ## projectKey
  sonar.projectName=          ## Name of the project
  sonar.projectVersion=1.0    ## The version of the project
  sonar.exclusions=**/__tests__/**       ## Exclude paths
  ```

- Add the following step to the GitHub Actions workflow file:

  ```yaml
  sonarqube:
    name: 📊 SonarQube Analysis
    runs-on: ubuntu-latest
    timeout-minutes: 15
    if: github.event_name == 'push' || github.event_name == 'pull_request'
    steps:
      - name: 🔬 Checkout to ${{ github.ref }}
        uses: actions/checkout@v4
        with:
          ref: ${{ github.ref }}
          fetch-depth: 0

      - name: 🔍 SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
  ```

## 📝 ESLint

We use **ESLint** to **_identify and fix problems_** in the TypeScript code.
