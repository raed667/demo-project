#!/bin/sh

#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
# INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
# PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
# FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
# TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
# OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

yflag=

while getopts yn: name
do
    case $name in
    y)    yflag=1;;
    ?)   printf "Usage: %s: [-y]\n" $0
          exit 2;;
    esac
done

MIN_NODE_VERSION=12

# Helper functions
function program_is_installed {
  local return_=1
  type $1 >/dev/null 2>&1 || { local return_=0; }
  echo "$return_"
}
function echo_fail {
  printf "\e[31m✘ ${1} \033\e[0m \n"
}
function echo_pass {
  printf "\e[32m✔ ${1} \033\e[0m \n"
}

# Check if node, yarn, and docker are installed
function check_installed_dependencies {
  [ "$(program_is_installed node)" != 1 ] && echo_fail "❇️ Node.js not found" && exit 1
  [ "$(program_is_installed yarn)" != 1 ] && echo_fail "🧵 Yarn not found" && exit 1
  [ "$(program_is_installed docker)" != 1 ] && echo_fail "🐳 Docker not found" && exit 1

  NODE_VERSION=`node -v | grep "v" | cut -c2- | awk -F. '{print $1}'`
  [ $NODE_VERSION -lt $MIN_NODE_VERSION ]  && echo_fail "Node.js needs at least v$MIN_NODE_VERSION, instead found v$NODE_VERSION" && exit 1
}

# Yarn install
function install_global_js_dependencies {
  yarn install --check-files --silent && { echo_pass "✨ Install success" ; } || { echo_fail "Something went wrong" ; exit 1; }
}

function install_js_dependencies {
  yarn --cwd $1 install --check-files --silent && { echo_pass "✨ Install success" ; } || { echo_fail "Something went wrong" ; exit 1; }
}

# Docker
function check_docker_running {
  `docker info > /dev/null 2>&1` || { echo_fail "🐳 Docker is not running (ℹ️  Start docker and run this script again)" ; exit 1; }
}

function remove_old_docker_images {
  if docker images | grep demo-project-$1 ; then
    echo "🧹🐳  Removing old \"demo-project-$1\" Docker images"
    docker rmi raedchammam/demo-project-$1 --force
  fi
}

function build_docker_images {
  yarn --cwd $1 docker:build && { echo_pass "✨ Docker $1 build success" ; } || { echo echo_fail "Something went wrong" ; exit 1; }
}

# Main function
echo_pass "Sit back, everything is under control... 🚀"
check_installed_dependencies

echo "📦 Installing project dependencies..."
install_global_js_dependencies

echo "📦 Installing frontend dependencies..."
install_js_dependencies "frontend"

echo "📦 Installing backend dependencies..."
install_js_dependencies "backend"

echo "📦 Installing real-time dependencies..."
install_js_dependencies "backend-realtime"

check_docker_running

if [ ! -z "$yflag" ]
then
    echo_pass "Lets do this..."
else
    while true; do
        read -p "🐳 Do you want to build and start the docker images? (y/N) " yn
        case $yn in
            [Yy]* ) echo "🐳 Building docker images from source...\n"; break;;
            * ) echo_pass "✅ All done, you can run \"yarn dev\" to start the project locally"; exit;;
        esac
    done
fi

# Clean old builds
remove_old_docker_images "backend"
remove_old_docker_images "frontend"
remove_old_docker_images "backend-realtime"
# Build new images
build_docker_images "backend"
build_docker_images "frontend"
build_docker_images "backend-realtime"

# Clean docker-compose before start
echo "🧹 🐳 Cleaning docker-compose before starting\n"
docker-compose -f .docker/docker-compose.yml stop
docker-compose -f .docker/docker-compose.yml down --volumes
# Start docker-compose
docker-compose -f .docker/docker-compose.yml up -d && { echo_pass "✨ Started images" ; } || { echo echo_fail "Exiting docker-compose" ; exit 0; }

echo "💻 Starting browser (swagger): http://localhost:3000/docs"
sleep 3 # Artificial delay to allow for service to be up
open "http://localhost:3000/api/docs"

echo "💻 Starting browser (Frontend): http://localhost"
sleep 3 # Artificial delay to allow for service to be up
open "http://localhost"

exit 0
