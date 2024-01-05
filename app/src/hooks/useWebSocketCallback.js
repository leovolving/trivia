import { useCallback, useEffect } from "react";
import { useAppContext } from "../ContextWrapper";

const useWebSocketCallback = (callbacks) => {
  const { mostRecentMessage } = useAppContext();

  const handleWebSocketMessage = useCallback(() => {
    const callback = callbacks[mostRecentMessage.type];
    if (callback) callback(mostRecentMessage.payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbacks]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleWebSocketMessage, [mostRecentMessage]);
};

export default useWebSocketCallback;
