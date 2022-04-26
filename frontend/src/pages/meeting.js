import { useEffect, useState } from 'react';
import { getMeetingId, getToken } from '../api';
import { Link as RouterLink } from 'react-router-dom';
import { VideoSDKMeeting } from '@videosdk.live/rtc-js-prebuilt';

// material
import { Button, Container, Stack, Typography, Grid } from '@mui/material';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Meeting() {
  const [token, setToken] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const getMeetingToken = async () => {
    const token = await getToken();
    setToken(token);
    const ID = await getMeetingId(token);
    console.log('ID', ID);
    setMeetingId(ID);
  };
  useEffect(() => {
    getMeetingToken();
    // token ? {} : null;
    const config = {
      name: '',
      meetingId: 'milkyway',
      apiKey: 'cbae9065-7437-4750-8026-9e695ff2566b',

      containerId: 'meeting-container-id',

      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      chatEnabled: true,
      screenShareEnabled: true,
      raiseHandEnabled: true,
      joinScreen: {
        visible: true,
        title: 'welcome To Learnigo Join Classroom',
        meetingUrl: 'customURL.com'
      },
      recording: {
        enabled: true,
        webhookUrl: 'https://www.videosdk.live/callback',
        awsDirPath: `/meeting-recordings/${meetingId}/`,
        autoStart: false,

        layout: {
          type: 'SIDEBAR', // "SPOTLIGHT" | "SIDEBAR" | "GRID"
          priority: 'PIN', // "SPEAKER" | "PIN",
          gridSize: 3
        }
      },
      whiteboardEnabled: true,
      permissions: {
        toggleRecording: true,
        removeParticipant: true,
        endMeeting: true,
        drawOnWhiteboard: true,
        toggleWhiteboard: true
      }
    };

    const meeting = new VideoSDKMeeting();
    meeting.init(config);
  }, []);
  return (
    <Page title="Dashboard: Training | Learnigo">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Planifier Training meet
          </Typography>
        </Stack>
      </Container>
      <Container
        id="meeting-container-id"
        direction={'row'}
        style={{ height: '500px', backgroundColor: 'whitesmoke' }}
      ></Container>
    </Page>
  );
}
