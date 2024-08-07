import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {EluvioPlayerParameters, InitializeEluvioPlayer} from "@eluvio/elv-player-js";
import {rootStore} from "@/stores/index.js";

const Video = observer(({
  objectId,
  clientOptions={},
  sourceOptions={},
  playoutParameters={},
  playerOptions={}

}) => {
  const [player, setPlayer] = useState();

  useEffect(() => {
    return () => {
      player?.Destroy();
    };
  }, []);

  if(!objectId) {
    // eslint-disable-next-line no-console
    console.warn("Unable to determine playout hash for video");
    return null;
  }

  return (
    <div
      ref={element => {
        if(!element | player) { return; }

        InitializeEluvioPlayer(
          element,
          {
            clientOptions: {
              client: rootStore.client,
              network: EluvioPlayerParameters.networks[rootStore.networkInfo.name === "main" ? "MAIN" : "DEMO"],
              ...clientOptions
            },
            sourceOptions: {
              protocols: [EluvioPlayerParameters.protocols.HLS],
              ...sourceOptions,
              playoutParameters: {
                objectId,
                ...playoutParameters
              }
            },
            playerOptions: {
              watermark: EluvioPlayerParameters.watermark.OFF,
              muted: EluvioPlayerParameters.muted.ON,
              autoplay: EluvioPlayerParameters.autoplay.OFF,
              controls: EluvioPlayerParameters.controls.AUTO_HIDE,
              loop: EluvioPlayerParameters.loop.OFF,
              playerProfile: EluvioPlayerParameters.playerProfile.LOW_LATENCY,
              ...playerOptions
            }
          },
        ).then(newPlayer => setPlayer(newPlayer));
      }}
    />
  );
});

export default Video;
