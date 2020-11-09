import Libp2p from 'libp2p'
import Websockets from 'libp2p-websockets'
import WebRTCStar from 'libp2p-webrtc-star'
import { NOISE } from 'libp2p-noise'
import Mplex from 'libp2p-mplex'
import Bootstrap from 'libp2p-bootstrap'
import Gossipsub from 'libp2p-gossipsub'

export const doWork = async ()=>{

    const libp2p = await Libp2p.create({
        addresses: {
          // Add the signaling server address, along with our PeerId to our multiaddrs list
          // libp2p will automatically attempt to dial to the signaling server so that it can
          // receive inbound connections from other peers
          listen: [
            '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
            '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
          ]
        },
        modules: {
          transport: [Websockets, WebRTCStar],
          connEncryption: [NOISE],
          streamMuxer: [Mplex],
          peerDiscovery: [Bootstrap],
          pubsub: Gossipsub
        },
        config: {
          peerDiscovery: {
            // The `tag` property will be searched when creating the instance of your Peer Discovery service.
            // The associated object, will be passed to the service when it is instantiated.
            [Bootstrap.tag]: {
              enabled: true,
              list: [
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
              ]
            }
          }
        }
      })
  
  await libp2p.start()

  window.libp2p = libp2p
  return {libp2p}
}