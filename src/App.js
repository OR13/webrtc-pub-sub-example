
import React from 'react'
import { doWork } from './doWork'
import querystring from 'querystring'

const PeerId = require('peer-id')
function App() {
  const [state, setState] = React.useState({})
  React.useEffect(()=>{
(async ()=>{

  const {libp2p } = await doWork();
  const peerId = libp2p.peerId.toB58String();

  // // Listen for new peers
  // libp2p.on('peer:discovery', (peerId) => {
  //   console.log(`Found peer ${peerId.toB58String()}`)
  // })

  // // Listen for new connections to peers
  // libp2p.connectionManager.on('peer:connect', (connection) => {
  //   console.log(`Connected to ${connection.remotePeer.toB58String()}`)
  // })

  // // Listen for peers disconnecting
  // libp2p.connectionManager.on('peer:disconnect', (connection) => {
  //   console.log(`Disconnected from ${connection.remotePeer.toB58String()}`)
  // })

 
  // const multiaddrs = libp2p.multiaddrs;
 let peers = [];
  if (window.location.search.split("?").pop()){
    ({peers} = querystring.parse(window.location.search.split("?").pop()))
    peers = JSON.parse(peers)
   
  }
  const topic = 'magical-topic'
  libp2p.pubsub.on(topic, (msg) => {
    console.log(`${peerId} received: `, msg)
  })

  await libp2p.pubsub.subscribe(topic)

  if (peers.length){
    peers.forEach(async (peerId)=>{
      peerId = PeerId.createFromB58String(peerId)
      libp2p.peerStore.addressBook.set( peerId , libp2p.multiaddrs)
      await libp2p.dial(peerId)
    })
  } else {
    setInterval(() => {
      libp2p.pubsub.publish(topic, new Uint8Array(Buffer.from('Bird bird bird, bird is the word!')));
    }, 1000)
  }

  setState((state)=> {
    return {...state, peerId}
  })
})()
  }, [])
  return (
    <div className="App">
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
