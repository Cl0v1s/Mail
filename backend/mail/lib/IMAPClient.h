/*
* @file IMAPClient.h
* @brief libcurl wrapper for IMAP operations
*
* @author Mohamed Amine Mzoughi <mohamed-amine.mzoughi@laposte.net>
* @date 2017-01-02
*/

#ifndef INCLUDE_IMAPCLIENT_H_
#define INCLUDE_IMAPCLIENT_H_

#include "MAILClient.h"

class CIMAPClient : public CMailClient
{
public:
   enum class MailProperty
   {
      Deleted,
      Seen,
      Answered,
      Flagged,
      Draft,
      Recent
   };
   enum class SearchOption
   {
      ANSWERED,
      DELETED,
      DRAFT,
      FLAGGED,
      NEW,
      RECENT,
      SEEN,
      SUBJECT,
   };


   explicit CIMAPClient(LogFnCallback oLogger);

   // copy constructor and assignment operator are disabled
   CIMAPClient(const CIMAPClient& Copy) = delete;
   CIMAPClient& operator=(const CIMAPClient& Copy) = delete;

   const bool CleanupSession() override;

   /* list the folders within a mailbox and save it in strList */
   const bool List(std::string& strList, const std::string& strFolderName = "");

   /* list the subscribed folders and save it in strList */
   const bool ListSubFolders(std::string& strList);

   /* send a string as an e-mail */
   const bool SendString(const std::string& strMail);

   /* send a text file as an e-mail */
   const bool SendFile(const std::string& strPath);

   /* retrieve e-mail and save its content in strOutput */
   const bool GetString(const std::string& strMsgNumber, std::string& strOutput, const std::string& strFolder = "INBOX");
   
   /* retrieve e-mail and save its content in a file */
   const bool GetFile(const std::string& strMsgNumber, const std::string& strFilePath);

   /* delete an existing folder */
   const bool DeleteFolder(const std::string& strMsgNumber);

   /* perform a noop */
   const bool Noop();

   /* copy an e-mail from one folder to another */
   const bool CopyMail(const std::string& strMsgNumber, std::string& strFolderFrom, const std::string& strFolderTo);

   /* create a new folder */
   const bool CreateFolder(const std::string& strFolderName);

   /* modify the properties of an e-mail according to MailProperty */
   const bool SetMailProperty(const std::string& strMsgNumber, MailProperty eNewProperty, const std::string& strFolder);
   
   /* search for e-mails according to SearchOption */
   const bool Search(std::string& strRes, SearchOption eSearchOption, const std::string& strSearchString = "", const std::string& strFolder = "INBOX");
      
   /* obtain information about a folder */
   const bool InfoFolder(std::string& strFolderName, std::string& strInfo);

   /* obtain headers of an email */
   const bool GetHeader(const std::string& strMsgNumber, std::string& strOutput, const std::string& strFolder = "INBOX");


protected:
   enum MailOperation
   {
      IMAP_NOOP,
      IMAP_LIST,
      IMAP_SEND_STRING,
      IMAP_SEND_FILE,
      IMAP_RETR_FILE,
      IMAP_RETR_STRING,
      IMAP_DELETE_FOLDER,
      IMAP_INFO_FOLDER,
      IMAP_LSUB,
      IMAP_COPY,
      IMAP_CREATE,
      IMAP_SEARCH,
      IMAP_STORE,

      IMAP_RETR_HEADER,
   };

   const bool PrePerform() override;
   const bool PostPerform(CURLcode ePerformCode) override;
   inline void ParseURL(std::string& strURL) override final;

   MailOperation        m_eOperationType;
   MailProperty         m_eMailProperty;
   SearchOption          m_eSearchOption;

   std::string          m_strSearchString;
   std::string          m_strFrom;
   std::string          m_strTo;
   std::string          m_strCc;
   std::string          m_strMail;
   std::string          m_strMsgNumber;
   std::string          m_strFolderName;
   std::string*         m_pstrText;

};

#endif
