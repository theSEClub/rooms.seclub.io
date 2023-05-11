import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';

var SIGNALING_SERVER = "wss://api.room.seclub.io:3000";

function Room() {

    const navigate = useNavigate();

    // get room id from url
    const { id } = useParams();
    const room = id;

    /** CONFIG **/
    var USE_AUDIO = true;
    var USE_VIDEO = true;
    var DEFAULT_CHANNEL = 'some-global-channel-name';
    var MUTE_AUDIO_BY_DEFAULT = false;

    // stun server
    /** Also see: https://gist.github.com/zziuni/3741933 **/
    var ICE_SERVERS = [
        { urls: "stun:stun.l.google.com:19302" }
    ];

    /* our own microphone / webcam */
    var local_media_stream = null;

    /* keep track of our peers */
    const [peers, setPeers] = useState([]);

    function attachMediaStream (id, stream) {
        setTimeout(() => {
            const element = document.getElementById(id);
            console.log('original function is DEPRECATED,this is a custom implementation.');
            element.srcObject = stream;
        }, 1000);
            
     };


    function init() {

        var functionPeers = peers;

        console.log("Connecting to signaling server");
        let signaling_socket = io(SIGNALING_SERVER);

        signaling_socket.on('connect', function () {
            console.log("Connected to signaling server");
            setup_local_media(function () {

                // once the user has given us access to their media => join the channel and start peering up 
                join_chat_channel(room, localStorage.getItem('username'));

            });
        });

        signaling_socket.on('disconnect', function () {
            console.log("Disconnected from signaling server");
            /* Tear down all of our peer connections and remove all the
            * media divs when we disconnect */
            for (peer_id in peer_media_elements) {
                peer_media_elements[peer_id].remove();
            }
            for (peer_id in peers) {
                peers[peer_id].close();
            }

            setPeers([]);
            functionPeers = [];

            peer_media_elements = {};
        });

        function join_chat_channel(room, username) {
            console.log("joining: ", { room, username });
            signaling_socket.emit('join', { room_id: room, username: username });
        }
        function part_chat_channel(channel) {
            signaling_socket.emit('part', channel);
        }


        /** 
        * When we join a group, our signaling server will send out 'addPeer' events to each pair
        * of users in the group (creating a fully-connected graph of users, i.e. if there are 6 people
        * in the channel you will connect directly to the other 5, so there will be a total of 15 
        * connections in the network). 
        */
        signaling_socket.on('addPeer', function (config) {
            console.log('Signaling server said to add peer:', config);

            var peer_id = config.peer_id;
            var username = config.username;

            peers.forEach(peer => {
                if (peer.peer_id === peer_id) {
                    /* This could happen if the user joins multiple channels where the other peer is also in. */
                    console.log("Already connected to peer ", peer_id);
                    return;
                }
            });

            var peer_connection = new RTCPeerConnection(
                { "iceServers": ICE_SERVERS },
                { "optional": [{ "DtlsSrtpKeyAgreement": true }] }
                // this will no longer be needed by chrome eventually (supposedly),
                // but is necessary for now to get firefox to talk to chrome .
            );

            setPeers(peers => {
                return [...peers, { peer_id: peer_id, username: username, peer_connection: peer_connection }]
            });
            functionPeers.push({ peer_id: peer_id, username: username, peer_connection: peer_connection });
            window.peers = peers;

            peer_connection.onicecandidate = function (event) {
                if (event.candidate) {
                    signaling_socket.emit('relayICECandidate', {
                        'peer_id': peer_id,
                        'ice_candidate': {
                            'sdpMLineIndex': event.candidate.sdpMLineIndex,
                            'candidate': event.candidate.candidate
                        }
                    });
                }
            }

            peer_connection.ontrack = function (event) {
                console.log("ontrack", event);
                peers.find(peer => peer.peer_id === peer_id).peer_stream = event.streams[0];
                setPeers(peers);
                functionPeers = peers;
            }

            /* Add our local stream */
            peer_connection.addStream(local_media_stream);

            /* Only one side of the peer connection should create the
            * offer, the signaling server picks one to be the offerer. 
            * The other user will get a 'sessionDescription' event and will
            * create an offer, then send back an answer 'sessionDescription' to us
            */
            if (config.should_create_offer) {
                console.log("Creating RTC offer to ", peer_id);
                peer_connection.createOffer(
                    function (local_description) {
                        console.log("Local offer description is: ", local_description);
                        peer_connection.setLocalDescription(local_description,
                            function () {
                                signaling_socket.emit('relaySessionDescription',
                                    { 'peer_id': peer_id, 'session_description': local_description });
                                console.log("Offer setLocalDescription succeeded");
                            },
                            function () { Alert("Offer setLocalDescription failed!"); }
                        );
                    },
                    function (error) {
                        console.log("Error sending offer: ", error);
                    });
            }
        });

        /** 
         * Peers exchange session descriptions which contains information
         * about their audio / video settings and that sort of stuff. First
         * the 'offerer' sends a description to the 'answerer' (with type
         * "offer"), then the answerer sends one back (with type "answer").  
         */
        signaling_socket.on('sessionDescription', function (config) {
            console.log('Remote description received: ', config);
            var peer_id = config.peer_id;
            console.log("sessionDescription peers: ", peers)
            console.log("sessionDescription config: ", config)
            const peerObject = peers.find(peer => peer.peer_id === peer_id)
            console.log('ice candidate:', peerObject)
            var peer = peerObject.peer_connection;
            var remote_description = config.session_description;

            console.log(config.session_description);
            var desc = new RTCSessionDescription(remote_description);

            var stuff = peer.setRemoteDescription(desc,
                function () {
                    console.log("setRemoteDescription succeeded");
                    if (remote_description.type == "offer") {
                        console.log("Creating answer");
                        peer.createAnswer(
                            function (local_description) {
                                console.log("Answer description is: ", local_description);
                                peer.setLocalDescription(local_description,
                                    function () {
                                        signaling_socket.emit('relaySessionDescription',
                                            { 'peer_id': peer_id, 'session_description': local_description });
                                        console.log("Answer setLocalDescription succeeded");
                                    },
                                    function () { console.log("Answer setLocalDescription failed!"); }
                                );
                            },
                            function (error) {
                                console.log("Error creating answer: ", error);
                                console.log(peer);
                            }
                        );
                    }
                },
                function (error) {
                    console.log("setRemoteDescription error: ", error);
                }
            );

            console.log("Description Object: ", desc);

        });

        /**
         * The offerer will send a number of ICE Candidate blobs to the answerer so they 
         * can begin trying to find the best path to one another on the net.
         */
        signaling_socket.on('iceCandidate', function (config) {
            console.log("iceCandidate peers: ", peers)
            console.log("iceCandidate config: ", config)
            var peer_id = config.peer_id;
            const peerObject = peers.find(peer => peer.peer_id === peer_id)
            console.log('ice candidate:', peerObject)
            var peer = peerObject.peer_connection;
            var ice_candidate = config.ice_candidate;
            console.log("adding ice candidate")
            peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
        });


        /**
         * When a user leaves a channel (or is disconnected from the
         * signaling server) everyone will recieve a 'removePeer' message
         * telling them to trash the media channels they have open for those
         * that peer. If it was this client that left a channel, they'll also
         * receive the removePeers. If this client was disconnected, they
         * wont receive removePeers, but rather the
         * signaling_socket.on('disconnect') code will kick in and tear down
         * all the peer sessions.
         */
        signaling_socket.on('removePeer', function (config) {
            console.log('Signaling server said to remove peer:', config);
            var peer_id = config.peer_id;
            peers.forEach(peer => {
                if (peer.peer_id === peer_id) {
                    peer.peer_connection.close();
                }
            });

            // if (peer_id in peers) {
            //     peers[peer_id].peer_connection.close();
            // }

            // remove peer from list
            // setPeers(peers => {
            //     peers?.filter(peer => peer !== peer_id)
            // });

            setPeers(peer => {
                peer?.filter(peer => peer.peer_id !== peer_id)
            })

            // delete peers[peer_id];
            // delete peer_media_elements[config.peer_id];

        });
        
        window.addEventListener('leave', () => {
            signaling_socket.emit('disconnect')
        }) 

    }

    /****************************************/
    /** Setting Local Media (getUserMedia) **/
    /****************************************/
    function setup_local_media(callback, errorback) {
        /* ie, if we've already been initialized */
        if (local_media_stream != null) {
            if (callback) callback();
            return;
        }

        // Ask user for permission to use the computers microphone and/or camera 
        console.log("Requesting access to local audio / video inputs");

        window.navigator.getUserMedia = (
            window.navigator.getUserMedia ||
            window.navigator.webkitGetUserMedia ||
            window.navigator.mozGetUserMedia ||
            window.navigator.msGetUserMedia
        );

        window.navigator.mediaDevices.getUserMedia({ "audio": USE_AUDIO, "video": USE_VIDEO })
            .then(function (stream) {
                console.log("Access granted to audio/video");
                local_media_stream = stream;
                document.querySelector('#local-video').srcObject = stream;

                if (callback) callback();
            })
            .catch(function () {
                console.log("Access denied for audio/video");
                alert("You chose not to provide access to the camera/microphone, join is denied.");
                if (errorback) errorback();
            })

    }

    function handleLeave() {
        window.dispatchEvent(new Event('leave'));
        navigate(`/`);
    }


    useEffect(() => {
        console.log("useEffect: room:- ", room)
        init();
        console.log("useEffect: peers:- ", peers)
    }, [])


    return (
        <>
            <div className='flex flex-col items-center justify-center gap-6 w-full p-6'>
                <div className='flex items-center justify-between w-1/2'>
                    <h1 className='text-center text-2xl'>{room}</h1>
                        <button className='btn btn-outline btn-secondary text-primary-content' onClick={()=>handleLeave()}>
                            Leave Room
                        </button>
                </div>
                <div className='flex justify-center items-center flex-wrap gap-6'>
                    <div className='p-6 flex flex-col items-center justify-center gap-6 border border-base-300 '>
                        <video id='local-video' className=' w-80 h-60' controls autoPlay muted >
                            Your browser does not support the video tag.
                        </video>
                        <div>
                            <h2 className='text-center text-info'>You</h2>
                        </div>
                    </div>
                    {
                        peers?.map((peer, index) => {
                            attachMediaStream(peer.peer_id + "-video", peer.peer_stream);
                            return (
                                <div key={index} className='p-6 flex flex-col items-center justify-center gap-6 border border-base-300 '>
                                    {
                                        peer.peer_stream && 
                                        <>
                                            <video id={peer.peer_id + "-video"} className=' w-80 h-60' controls autoPlay>
                                                Your browser does not support the video tag.
                                            </video>
                                        </>
                                    }
                                    <div>
                                        <h2 className='text-center text-secondary'>{peer.username}</h2>
                                    </div>
                                </div>
                            )
                            }
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Room
