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

            "backend/Command.hpp"
            "backend/Command.cpp"
            
            "backend/main.cpp")

include_directories(/usr/local/include)
link_directories(/usr/local/lib)
find_package(PkgConfig REQUIRED)


find_package(Boost REQUIRED regex)
message("Boost found: ${Boost_FOUND}")

set(OPENSSL_ROOT_DIR /usr/local/opt/openssl)
find_package(OpenSSL REQUIRED)
message("OpenSSL found: ${OpenSSL_FOUND}")

find_package(nlohmann_json REQUIRED)
message("nlohmann_json found: ${nlohmann_json_FOUND}")

find_package(CURL REQUIRED)
message("CURL found: ${CURL_FOUND}")

find_package(rnp REQUIRED librnp)
message("rnp found: ${rnp_FOUND}")

find_package(ZLIB REQUIRED)
message("ZLIB found: ${ZLIB_FOUND}")

find_package(BZip2 REQUIRED)
message("BZip2 found: ${BZip2_FOUND}")

pkg_check_modules(JSONC REQUIRED IMPORTED_TARGET json-c)
add_library(JSON-C::JSON-C ALIAS PkgConfig::JSONC)
message("JSON-C Found: TRUE")

pkg_check_modules(Botan2 REQUIRED IMPORTED_TARGET botan-2)
add_library(Botan2::Botan2 ALIAS PkgConfig::Botan2)
message("Botan2 Found: TRUE")

add_app("${SOURCES}")
# bug in cmake which cause to use apple version of open ssl instead of detected one
target_link_libraries(${PROJECT_NAME} ${Boost_LIBRARIES})
target_link_libraries(${PROJECT_NAME} "${OpenSSL_LIBRARIES}")
target_link_libraries(${PROJECT_NAME} "${nlohmann_json_LIBRARIES}")
target_link_libraries(${PROJECT_NAME} "${CURL_LIBRARIES}")
target_link_libraries(${PROJECT_NAME} "rnp::librnp")
target_link_libraries(${PROJECT_NAME} "${LINK_DIRECTORY}/libbotan-2.dylib")


target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_14)