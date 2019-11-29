module Handlers ( errorHandler, getMessagesHandler, getNewerMessagesHandler
                , addMessageHandler, parseBody
                ) where

import Prelude hiding (apply)
import Data.Int (fromString)
import Data.Maybe (Maybe(..))
import Data.Either (Either(..))
import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (runExcept)
import Effect.Class (liftEffect)
import Effect.Console (log)
import Effect.Exception (Error, message, error)
import Effect.Aff.Class (liftAff)
import Node.Express.Request (getRequestHeader, getBody, getMethod)
import Node.Express.Response (sendJson, setStatus)
import Node.Express.Handler (Handler, next)
import Node.Express.Types (Method (POST))
import SQLite3 (DBConnection)
import Effect.Now (now)
import Middleware.Middleware as Middleware

import Types (Timestamp(..), RawTimestamp, RawMsg, instantToTimestamp, opSucceded, opFailed)
import Database (prepareDb, sqlGetMessages, sqlInsertMessage
                , sqlGetNewerMessages)

errorHandler :: Error -> Handler
errorHandler err = do
  setStatus 400
  sendJson {error: message err}

getMessagesHandler :: DBConnection -> Handler
getMessagesHandler db = do
  let db' = prepareDb db
  msgs <- liftAff $ db' sqlGetMessages
  sendJson msgs

getNewerMessagesHandler :: DBConnection -> Handler
getNewerMessagesHandler db = do
  let db' = prepareDb db
  body <- getBody
  case runExcept body of
    Right ({timestamp: mts} :: RawTimestamp) -> do
      case fromString mts of
        Just ts -> do
          msgs <- liftAff $ db' $ sqlGetNewerMessages $ Timestamp ts
          sendJson msgs
        Nothing-> do
          liftEffect $ log "given timestamp is not an int"
          sendJson opFailed
    Left e -> do
      liftEffect $ log $ show e
      sendJson opFailed


addMessageHandler :: DBConnection -> Handler
addMessageHandler db = do
    body <- getBody
    case runExcept body of
      Right ({msg: msg} :: RawMsg) -> do
          ts <- liftEffect $ instantToTimestamp <$> now
          _ <- liftAff $ db' $ sqlInsertMessage {msg: msg, timestamp: ts}
          sendJson opSucceded
      Left e -> do
          liftEffect $ log $ show e
          sendJson opFailed
  where db' = prepareDb db

parseBody :: Handler
parseBody = do
  getMethod >>= case _ of
    POST -> getRequestHeader "Content-Type" >>= case _ of
      Just "application/x-www-form-urlencoded; charset=UTF-8"
            -> Middleware.urlencoded
      Just "application/x-www-form-urlencoded"
            -> Middleware.urlencoded
      Just "application/json; charset=UTF-8"
            -> Middleware.json
      Just "application/json"
            -> Middleware.json
      Just contentType -> throwError $ error $ "Unknown Content-Type: " <> contentType
      Nothing          -> throwError $ error $ "Content-Type not present"
    _ -> next
