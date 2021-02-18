project(MyApp C CXX)
cmake_minimum_required(VERSION 3.3.2)

include(cmake/App.cmake)

set(SOURCES 
            "backend/utils/cpp-base64/base64.h"
            "backend/utils/cpp-base64/base64.cpp"

            "backend/utils/QuotedPrintable/QuotedPrintable.hpp"

            "backend/mail/lib/IMAPClient.h"
            "backend/mail/lib/IMAPClient.cpp"
            "backend/mail/lib/MAILClient.h"
            "backend/mail/lib/MAILClient.cpp"
            "backend/mail/lib/POPClient.h"
            "backend/mail/lib/POPClient.cpp"
            "backend/mail/lib/SMTPClient.h"
            "backend/mail/lib/SMTPClient.cpp"

            "backend/mail/Mailer.hpp"
            "backend/mail/Mailer.cpp"

            "backend/PGP/PGP.hpp"
            "backend/PGP/PGP.cpp"

            "backend/GUI/MailApp.h"
            "backend/GUI/MailApp.cpp"

            "backend/account/AccountManager.hpp"
            "backend/account/AccountManager.cpp"

            "backend/model/Account.hpp"
            "backend/model/Account.cpp"
            "backend/model/Folder.hpp"
            "backend/model/Folder.cpp"
            "backend/model/Mail.hpp"
            "backend/model/Mail.cpp"

            "backend/Command.hpp"
            "backend/Command.cpp"
            
            "backend/main.cpp")


set(BOOST_ROOT_DIR "/usr/local/Cellar/boost/1.75.0/")
find_package(Boost REQUIRED)
include_directories("${BOOST_ROOT_DIR}include/")

set(OPENSSL_ROOT_DIR "/usr/local/Cellar/openssl@1.1/1.1.1i/")
find_package(OpenSSL REQUIRED)
include_directories(${OPENSSL_INCLUDE_DIR})

set(JSON_ROOT_DIR "/usr/local/Cellar/nlohmann-json/3.9.1_1")
include_directories("${JSON_ROOT_DIR}/include")

set(CURL_ROOT_DIR "/usr/local/opt/curl")
include_directories("${CURL_ROOT_DIR}/include")

include_directories("/usr/local/include/rnp-0")

add_app("${SOURCES}")
# bug in cmake which cause to use apple version of open ssl instead of detected one
target_link_libraries(${PROJECT_NAME} "${BOOST_ROOT_DIR}/lib/libboost_regex.dylib")
target_link_libraries(${PROJECT_NAME} "/usr/local/Cellar/openssl@1.1/1.1.1i/lib/libcrypto.dylib")
target_link_libraries(${PROJECT_NAME} "/usr/local/Cellar/nlohmann-json/3.9.1_1/lib/cmake/nlohmann_json/nlohmann_jsonConfig.cmake")
target_link_libraries(${PROJECT_NAME} "${CURL_ROOT_DIR}/lib/libcurl.dylib")
target_link_libraries(${PROJECT_NAME} "/usr/local/lib/librnp-0.dylib")


target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_14)