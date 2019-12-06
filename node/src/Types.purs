module Types ( Timestamp(..)
             , RawTimestamp
             , Msg(..)
             , RawMsg
             , OperationStatus
             , instantToTimestamp
             , msgToRaw
             , opSucceded
             , opFailed
             ) where

import Prelude hiding (apply)
import Data.Int (floor)
import Data.Newtype (class Newtype, wrap, unwrap)
import Data.DateTime.Instant (Instant, unInstant)
import Simple.JSON ( class ReadForeign , readImpl
                   , class WriteForeign, writeImpl
                   )
-- | Newtype wrapper for `Int` representing a Unix-timestamp
newtype Timestamp = Timestamp Int

derive instance eqTimestamp :: Eq Timestamp

derive instance newtypeTimestamp :: Newtype Timestamp _

instance showTimestamp :: Show Timestamp where
  show (Timestamp t) = "Timestamp " <> show t

instance readTs :: ReadForeign Timestamp where
  readImpl a = do
    b <- readImpl a
    pure $ Timestamp b

instance writeTs :: WriteForeign Timestamp where
  writeImpl (Timestamp a) = writeImpl a

-- | Transforms an `Instant` to a `Timestamp`
instantToTimestamp :: Instant -> Timestamp
instantToTimestamp = wrap <<< floor <<< (flip div 1000.0) <<< unwrap <<< unInstant

-- | Representation of a raw timestamp.
-- | This is easily communicatable via http/xhr/json
type RawTimestamp = { timestamp :: String }

-- | Representation of a message, holding the message and the time the message
-- | was written
type Msg = { msg       :: String
           , timestamp :: Timestamp
           }

-- | Representation of a raw message.
-- | This is easily communicatable via http/xhr/json
type RawMsg = { msg :: String }

-- | Representation of the outcome of an operation.
-- | This is easily communicatable via http/xhr/json
type OperationStatus = { success :: Boolean}

msgToRaw :: Msg -> RawMsg
msgToRaw msg = { msg: msg.msg }

-- | Represents success of an operation
opSucceded :: OperationStatus
opSucceded = {success: true}

-- | Represents failure of an operation
opFailed :: OperationStatus
opFailed = {success: false}
