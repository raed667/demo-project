#!/bin/sh

#  ______               _
#  | ___ \             | |
#  | |_/ /__ _  ___  __| |
#  |    // _` |/ _ \/ _` |
#  | |\ \ (_| |  __/ (_| |
#  \_| \_\__,_|\___|\__,_|
#
#  v0.0.0
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
# INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
# PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
# FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
# TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
# OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function echo_fail {
  printf "\e[31m✘ ${1} \033\e[0m \n"
}
function echo_pass {
  printf "\e[32m✔ ${1} \033\e[0m \n"
}

# Docker
function check_docker_running {
  `docker info > /dev/null 2>&1` || { echo_fail "🐳 Docker is not running (ℹ️  Start docker and run this script again)" ; exit 1; }
}

# Yarn
function clean_js_build {
  yarn --cwd $1 clean --silent && { echo_pass "✨ Cleaning success" ; } || { echo_fail "Something went wrong" ; exit 1; }
}

# Main function
echo_pass "Sit back, everything is under control... 🧹"

check_docker_running

# Clean docker-compose
echo "🧹 🐳 Cleaning docker-compose\n"
docker-compose -f .docker/docker-compose.yml stop
docker-compose -f .docker/docker-compose.yml down --volumes --remove-orphans --rmi all
echo_pass "✨ Removed docker images"

echo "🧹 📦 Cleaning builds\n"
clean_js_build "frontend"
clean_js_build "backend"
clean_js_build "backend-realtime"

echo "🧹 📦 Cleaning node_modules\n"
find . -name "node_modules" -type d -prune | xargs du -chs
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
echo_pass "✨ Cleaned node_modules"

echo_pass "✅ All done"

exit 0
