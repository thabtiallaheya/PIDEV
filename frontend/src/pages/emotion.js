import * as faceapi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';
import Page from '../components/Page';
import { Link as RouterLink } from 'react-router-dom';

// material
import { Button, Box, Grid, Container, Typography, Divider, Stack } from '@mui/material';

import { Icon } from '@iconify/react';
export default function Emotion() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);

  const videoRef = useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]).then(setModelsLoaded(true));
    };
    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error('error:', err);
      });
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        const displaySize = {
          width: videoWidth,
          height: videoHeight
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvasRef &&
          canvasRef.current &&
          canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      }
    }, 100);
  };

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  };
  return (
    <Page title="Training | Learnigo">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Your opinion is important to us
          </Typography>
        </Stack>
      </Container>
      <Container>
        <div style={{ textAlign: 'center', padding: '10px' }}>
          {captureVideo && modelsLoaded ? (
            <Button
              variant="contained"
              startIcon={<Icon icon="akar-icons:arrow-back-thick" />}
              component={RouterLink}
              to={`/training`}
              onClick={closeWebcam}
            >
              Back to Trainings
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Icon icon="bx:log-in-circle" />}
              onClick={startVideo}
            >
              Review now
            </Button>
          )}
        </div>
        {captureVideo ? (
          modelsLoaded ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '10px'
                }}
              >
                <video
                  ref={videoRef}
                  height={videoHeight}
                  width={videoWidth}
                  onPlay={handleVideoOnPlay}
                  style={{ borderRadius: '10px' }}
                />
                <canvas ref={canvasRef} style={{ position: 'absolute' }} />
              </div>
            </div>
          ) : (
            <div>loading...</div>
          )
        ) : (
          <></>
        )}
      </Container>
    </Page>
  );
}
