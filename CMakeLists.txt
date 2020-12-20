project(MyApp C CXX)
cmake_minimum_required(VERSION 3.3.2)

include(cmake/App.cmake)

set(SOURCES 
            "src/socket/Socket.hpp"
            "src/socket/Socket.cpp"

            "src/GUI/MailApp.h"
            "src/GUI/MailApp.cpp"

            "src/Command.hpp"
            "src/Command.cpp"
            
            "src/main.cpp")


set(BOOST_ROOT_DIR "/usr/local/Cellar/boost/1.75.0/")
find_package(Boost REQUIRED)
include_directories("${BOOST_ROOT_DIR}include/")

set(OPENSSL_ROOT_DIR "/usr/local/Cellar/openssl@1.1/1.1.1h/")
find_package(OpenSSL REQUIRED)
include_directories(${OPENSSL_INCLUDE_DIR})

set(JSON_ROOT_DIR "/usr/local/Cellar/nlohmann-json/3.9.1_1")
include_directories("${JSON_ROOT_DIR}/include")

add_app("${SOURCES}")
# bug in cmake which cause to use apple version of open ssl instead of detected one
target_link_libraries(${PROJECT_NAME} "/usr/local/Cellar/openssl@1.1/1.1.1h/lib/libcrypto.dylib")
target_link_libraries(${PROJECT_NAME} "/usr/local/Cellar/nlohmann-json/3.9.1_1/lib/cmake/nlohmann_json/nlohmann_jsonConfig.cmake")
