function App() {
  // ... existing state and functions

  return (
    <div className="app-container">
      <div className="video-container">
        {remoteStream && (
          <video
            className="remote-video"
            ref={remoteVideoRef}
            autoPlay
            playsInline
          />
        )}
        <video
          className="local-video"
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
        />
        
        <div className="calling-status">
          {callStatus === 'calling' && 'Calling...'}
          {callStatus === 'incoming' && 'Incoming Call...'}
          {callStatus === 'connected' && 'Connected'}
        </div>

        <div className="controls">
          <button 
            className="control-button"
            onClick={toggleMute}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          
          <button 
            className="control-button"
            onClick={toggleVideo}
          >
            {isVideoOff ? '📵' : '📹'}
          </button>
          
          {callStatus === 'incoming' ? (
            <>
              <button 
                className="control-button"
                onClick={answerCall}
              >
                📞
              </button>
              <button 
                className="control-button end-call"
                onClick={rejectCall}
              >
                ❌
              </button>
            </>
          ) : (
            <button 
              className="control-button end-call"
              onClick={endCall}
            >
              ❌
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 