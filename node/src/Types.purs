module Types (Timestamp(..), Msg(..), RawMsg) where

import Prelude hiding (apply)
import Data.Newtype (class Newtype)
import Simple.JSON (class ReadForeign, readImpl)

newtype Timestamp = Timestamp Int

derive instance eqTimestamp :: Eq Timestamp
derive instance newtypeTimestamp :: Newtype Timestamp _
instance showTimestamp :: Show Timestamp where
  show (Timestamp t) = "Timestamp " <> show t

instance readTs :: ReadForeign Timestamp where
  readImpl a = do
    b <- readImpl a
    pure $ Timestamp b


type Msg = { msg       :: String
           , timestamp :: Timestamp
           }





type RawMsg = {"msg" :: String }

{-
instance readMsg :: ReadForeign Msg where
  readImpl = do
    s <- readImpl
    (i :: Number) <- readImpl
    case (instant $ Milliseconds i) of
      Just is -> pure $ Msg {msg: s, inst: Milliseconds is}
      Nothing -> fail $ ForeignError "could not read foreign timestamp"

-}
