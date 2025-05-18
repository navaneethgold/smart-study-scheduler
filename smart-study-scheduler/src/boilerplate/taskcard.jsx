import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function TaskCard({ task }) {
  return (
    <Box sx={{ minWidth: 275, mb: 2 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Subject: {task.subject}
          </Typography>
          <Typography variant="h5" component="div">
            Chapter: {task.chapter}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Duration: {task.durationInMin} min
          </Typography>
          <Typography variant="body2">
            Pomodoros: {task.approxpomo}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Status: {task.done ? "Completed ✅" : "Pending ⏳"}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Start Timer</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
