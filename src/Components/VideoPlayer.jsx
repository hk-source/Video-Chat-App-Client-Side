import React,{useContext} from 'react'
import {Grid,Typography,Paper} from '@mui/material'
import { styled } from '@mui/material/styles';
import { SocketContext } from '../SocketContext'

const VideoContainer = styled(Paper)(({ theme }) => ({
  padding: '10px',
  border: '2px solid black',
  margin: '10px',
}));

const Video = styled('video')(({ theme }) => ({
  width: '550px',
  [theme.breakpoints.down('xs')]: {
    width: '300px',
  },
}));

const VideoPlayer = () => {
  const {name,callAccepted,myVideo,userVideo,callEnded,stream,call}=useContext(SocketContext)
  return (
    <Grid container justifyContent='center'>
      {/* Our own video*/}
      {
        stream && (// only when there is an allowance of the video and audio stream then only display this 'our video section'
            <VideoContainer>
              <Grid item xs={12} md={6}>
                <Typography variant='h5' gutterBottom>{name || 'Name'}</Typography>
                <Video playsInline muted ref={myVideo} autoPlay />
              </Grid>
            </VideoContainer>
        )
      }
      {/* User's video*/}
      {
        callAccepted && !callEnded &&(
        <VideoContainer>
          <Grid item xs={12} md={6}>
            <Typography variant='h5' gutterBottom>{call.name||'name'}</Typography>
            <Video playsInline ref={userVideo} autoPlay />
          </Grid>
        </VideoContainer>
        )
      }
    </Grid>
  )
}

export default VideoPlayer
